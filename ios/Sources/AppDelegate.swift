import UIKit
import WebKit
import CryptoKit
import Compression

// 외계행성 1000부대 막기 — iOS 껍데기
// 안드로이드 앱(MainActivity.java)과 같은 동작:
//  - 게임(index.html 한 파일)을 WKWebView에 띄움
//  - version.json을 확인해 새 게임 파일(zip)을 받아 두고, 게임이 "지금 적용"을 누르면 바꿔서 다시 로드
//  - JS에서 쓰는 KXApp.appVersion() / applyUpdate() / takeMigration() 제공

@main
final class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        let w = UIWindow(frame: UIScreen.main.bounds)
        w.backgroundColor = GameViewController.bg
        w.rootViewController = GameViewController()
        w.makeKeyAndVisible()
        window = w
        application.isIdleTimerDisabled = true
        return true
    }
}

final class GameViewController: UIViewController, WKScriptMessageHandler, WKNavigationDelegate, UIScrollViewDelegate {
    static let bg = UIColor(red: 0x0b / 255.0, green: 0x06 / 255.0, blue: 0x05 / 255.0, alpha: 1)
    static let updateURL = URL(string: "https://raw.githubusercontent.com/wakamonlabs/kx1000/main/version.json")!

    private var web: WKWebView!
    private var readyBuild = -1

    // MARK: 버전·경로
    private var bundledBuild: Int {
        if let s = Bundle.main.object(forInfoDictionaryKey: "KXBundledBuild") as? String, let v = Int(s) { return v }
        if let v = Bundle.main.object(forInfoDictionaryKey: "KXBundledBuild") as? Int { return v }
        return 0
    }
    private var installedBuild: Int {
        get { UserDefaults.standard.integer(forKey: "kx_build") }
        set { UserDefaults.standard.set(newValue, forKey: "kx_build") }
    }
    private var docs: URL { FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0] }
    private var gameDir: URL { docs.appendingPathComponent("game", isDirectory: true) }
    private var gameFile: URL { gameDir.appendingPathComponent("index.html") }
    private var newDir: URL { docs.appendingPathComponent("game_new", isDirectory: true) }
    private var currentBuild: Int {
        max(bundledBuild, FileManager.default.fileExists(atPath: gameFile.path) ? installedBuild : 0)
    }
    private var appVersionText: String {
        let v = (Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String) ?? "?"
        return "\(v) (\(currentBuild))"
    }

    // MARK: 화면
    override var prefersStatusBarHidden: Bool { true }
    override var prefersHomeIndicatorAutoHidden: Bool { true }
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask { .portrait }
    override var preferredScreenEdgesDeferringSystemGestures: UIRectEdge { .bottom }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = Self.bg

        let cfg = WKWebViewConfiguration()
        cfg.allowsInlineMediaPlayback = true
        cfg.mediaTypesRequiringUserActionForPlayback = []
        cfg.websiteDataStore = .default()
        let uc = WKUserContentController()
        let ver = appVersionText.replacingOccurrences(of: "'", with: "")
        let bridge = """
        window.KXApp={appVersion:function(){return '\(ver)'},applyUpdate:function(){try{window.webkit.messageHandlers.kx.postMessage('apply')}catch(e){}},takeMigration:function(){return null}};
        """
        uc.addUserScript(WKUserScript(source: bridge, injectionTime: .atDocumentStart, forMainFrameOnly: true))
        let css = """
        (function(){var s=document.createElement('style');s.textContent='*{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent}';document.documentElement.appendChild(s)})();
        """
        uc.addUserScript(WKUserScript(source: css, injectionTime: .atDocumentEnd, forMainFrameOnly: true))
        uc.add(self, name: "kx")
        cfg.userContentController = uc

        web = WKWebView(frame: .zero, configuration: cfg)
        web.isOpaque = false
        web.backgroundColor = Self.bg
        web.scrollView.backgroundColor = Self.bg
        web.scrollView.isScrollEnabled = false
        web.scrollView.bounces = false
        web.scrollView.contentInsetAdjustmentBehavior = .never
        web.scrollView.delegate = self
        web.navigationDelegate = self
        web.allowsLinkPreview = false
        web.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(web)
        // 노치·홈 바를 피해서 안전 영역 안에만 게임을 띄움
        let g = view.safeAreaLayoutGuide
        NSLayoutConstraint.activate([
            web.topAnchor.constraint(equalTo: g.topAnchor),
            web.bottomAnchor.constraint(equalTo: g.bottomAnchor),
            web.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            web.trailingAnchor.constraint(equalTo: view.trailingAnchor),
        ])
        loadGame()
        DispatchQueue.global(qos: .utility).async { [weak self] in self?.checkUpdate() }
    }

    func viewForZooming(in scrollView: UIScrollView) -> UIView? { nil }

    private func loadGame() {
        if installedBuild > bundledBuild, FileManager.default.fileExists(atPath: gameFile.path) {
            web.loadFileURL(gameFile, allowingReadAccessTo: gameDir)
        } else if let u = Bundle.main.url(forResource: "index", withExtension: "html") {
            web.loadFileURL(u, allowingReadAccessTo: u.deletingLastPathComponent())
        }
    }

    // 웹 내용이 메모리 부족으로 죽으면 다시 띄움
    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) { loadGame() }

    // MARK: JS → 앱
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if let s = message.body as? String, s == "apply" { applyReady() }
    }

    // MARK: 자동 업데이트
    private func checkUpdate() {
        let cfg = URLSessionConfiguration.ephemeral
        cfg.requestCachePolicy = .reloadIgnoringLocalCacheData
        cfg.timeoutIntervalForRequest = 10
        cfg.timeoutIntervalForResource = 120
        let session = URLSession(configuration: cfg)
        guard let data = syncGet(session, Self.updateURL),
              let o = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let v = o["version"] as? Int, let zipS = o["zip"] as? String, let zipU = URL(string: zipS) else { return }
        let sha = (o["sha256"] as? String) ?? ""
        let note = (o["note"] as? String) ?? ""
        if v <= currentBuild { return }
        guard let zip = syncGet(session, zipU) else { return }
        if !sha.isEmpty {
            let h = SHA256.hash(data: zip).map { String(format: "%02x", $0) }.joined()
            if h.lowercased() != sha.lowercased() { return }
        }
        guard let html = Self.unzipIndex(zip) else { return }
        do {
            try? FileManager.default.removeItem(at: newDir)
            try FileManager.default.createDirectory(at: newDir, withIntermediateDirectories: true)
            try html.write(to: newDir.appendingPathComponent("index.html"), options: .atomic)
        } catch { return }
        DispatchQueue.main.async {
            self.readyBuild = v
            let q = (try? JSONSerialization.data(withJSONObject: [note])).flatMap { String(data: $0, encoding: .utf8) } ?? "[\"\"]"
            self.web.evaluateJavaScript("window.kxUpdateReady&&kxUpdateReady(\(v),\(q)[0])", completionHandler: nil)
        }
    }

    private func applyReady() {
        guard readyBuild >= 0 else { return }
        let fm = FileManager.default
        do {
            try fm.createDirectory(at: gameDir, withIntermediateDirectories: true)
            if fm.fileExists(atPath: gameFile.path) { try fm.removeItem(at: gameFile) }
            try fm.moveItem(at: newDir.appendingPathComponent("index.html"), to: gameFile)
            installedBuild = readyBuild
            readyBuild = -1
            loadGame()
        } catch {}
    }

    private func syncGet(_ s: URLSession, _ u: URL) -> Data? {
        let sem = DispatchSemaphore(value: 0)
        var out: Data?
        var req = URLRequest(url: u)
        req.cachePolicy = .reloadIgnoringLocalCacheData
        s.dataTask(with: req) { d, r, _ in
            if let h = r as? HTTPURLResponse, h.statusCode == 200 { out = d }
            sem.signal()
        }.resume()
        _ = sem.wait(timeout: .now() + 150)
        return out
    }

    // MARK: zip에서 index.html 꺼내기 (중앙 디렉터리 기준, 저장/deflate 지원)
    static func unzipIndex(_ z: Data) -> Data? {
        let b = [UInt8](z)
        func u16(_ i: Int) -> Int { Int(b[i]) | Int(b[i + 1]) << 8 }
        func u32(_ i: Int) -> Int { Int(b[i]) | Int(b[i + 1]) << 8 | Int(b[i + 2]) << 16 | Int(b[i + 3]) << 24 }
        guard b.count > 22 else { return nil }
        var eocd = -1
        var i = b.count - 22
        while i >= max(0, b.count - 65557) {
            if u32(i) == 0x06054b50 { eocd = i; break }
            i -= 1
        }
        guard eocd >= 0 else { return nil }
        let n = u16(eocd + 10)
        var p = u32(eocd + 16)
        for _ in 0..<n {
            guard p + 46 <= b.count, u32(p) == 0x02014b50 else { return nil }
            let method = u16(p + 10), csize = u32(p + 20), usize = u32(p + 24)
            let nl = u16(p + 28), el = u16(p + 30), cl = u16(p + 32), off = u32(p + 42)
            let name = String(bytes: b[(p + 46)..<(p + 46 + nl)], encoding: .utf8) ?? ""
            p += 46 + nl + el + cl
            if !name.hasSuffix("index.html") { continue }
            guard off + 30 <= b.count, u32(off) == 0x04034b50 else { return nil }
            let start = off + 30 + u16(off + 26) + u16(off + 28)
            guard start + csize <= b.count else { return nil }
            let comp = Data(b[start..<(start + csize)])
            if method == 0 { return comp }
            if method != 8 { return nil }
            var dst = Data(count: usize)
            let got = dst.withUnsafeMutableBytes { (d: UnsafeMutableRawBufferPointer) -> Int in
                comp.withUnsafeBytes { (s: UnsafeRawBufferPointer) -> Int in
                    compression_decode_buffer(d.bindMemory(to: UInt8.self).baseAddress!, usize,
                                              s.bindMemory(to: UInt8.self).baseAddress!, csize,
                                              nil, COMPRESSION_ZLIB)
                }
            }
            return got == usize ? dst : nil
        }
        return nil
    }
}
