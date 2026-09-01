import { Link } from "wouter";
import {
  Zap,
  Globe,
  FileSpreadsheet,
  WifiOff,
  Lock,
  Smartphone,
} from "lucide-react";

// LP方針:
// - アプリ本体と同一のネオ・ブルータリズム(黒2px罫線 / ハードシャドウ / Safety Orange / 角丸ゼロ)で
//   「LPとアプリが地続き」であることを視覚的に保証し、CTA遷移の心理的コストを下げる。
// - 主張はひとつ:「記録が速いから続く」。速さの証拠として実UIのテンキーを再現して見せる。

const KEYPAD_KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "00", "⌫"];

function KeypadMock() {
  return (
    <div className="neo-border neo-shadow bg-background p-4 w-full max-w-sm mx-auto select-none">
      <div className="flex items-baseline justify-between border-b-2 border-border pb-3 mb-3">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          今日の支出
        </span>
        <span className="text-4xl font-bold tabular-nums">
          ¥1,280
        </span>
      </div>
      <div className="flex gap-2 mb-3">
        <span className="neo-border bg-primary px-3 py-1 text-xs font-bold">食費</span>
        <span className="neo-border px-3 py-1 text-xs font-bold text-muted-foreground">ランチ</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {KEYPAD_KEYS.map((key) => (
          <div
            key={key}
            className="neo-border neo-shadow-sm flex items-center justify-center py-3 text-lg font-bold bg-background"
          >
            {key}
          </div>
        ))}
      </div>
      <div className="neo-border neo-shadow-sm mt-2 bg-primary py-3 text-center text-lg font-bold uppercase tracking-wider">
        確定
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: Globe,
    title: "4通貨対応",
    body: "JPY / USD / EUR / CNY を設定から即切り替え。海外旅行や出張の支出もそのまま記録。",
  },
  {
    icon: FileSpreadsheet,
    title: "CSVエクスポート",
    body: "蓄積したデータは標準CSVで出力。集計やグラフ化はExcelやスプレッドシートで自由に。",
  },
  {
    icon: WifiOff,
    title: "オフライン動作",
    body: "PWAなので機内モードでも起動・記録が可能。電波を待つ時間はありません。",
  },
  {
    icon: Lock,
    title: "データは端末内のみ",
    body: "記録は外部サーバーに一切送信されません。ローカルストレージに保存され、見られるのはあなただけ。",
  },
];

const START_STEPS = [
  {
    num: "1",
    title: "ブラウザで開く",
    body: "App StoreもGoogle Playも不要。このままブラウザでアプリを開くだけ。",
  },
  {
    num: "2",
    title: "ホーム画面に追加",
    body: "共有メニューから「ホーム画面に追加」で、ネイティブアプリと同じ使い心地に。",
  },
  {
    num: "3",
    title: "記録する",
    body: "開いた瞬間にテンキー。最初の支出を打ち込めば、もう習慣の始まりです。",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b-2 border-border">
        <div className="container flex items-center justify-between py-4">
          <span className="neo-border neo-shadow-sm bg-primary px-3 py-1 text-lg font-bold uppercase tracking-widest">
            サクキロ
          </span>
          <Link
            href="/"
            className="neo-btn bg-background px-4 py-2 text-sm"
          >
            アプリを開く
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="border-b-2 border-border">
          <div className="container grid gap-10 py-14 lg:grid-cols-2 lg:items-center md:py-20">
            <div>
              <p className="mb-4 inline-block border-2 border-border bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-widest text-secondary-foreground">
                無料・登録不要・インストール不要の家計簿PWA
              </p>
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                財布から小銭を
                <br />
                出すより、<span className="bg-primary px-2">速い。</span>
              </h1>
              <p className="mt-6 max-w-md text-lg font-medium text-muted-foreground">
                サクキロは開いた瞬間にテンキーが<span className="whitespace-nowrap">立ち上がる</span>
                <span className="whitespace-nowrap">支出記録アプリ</span>。
                ロード画面もログインもなし。
                <strong className="text-foreground">
                  起動→金額入力→<span className="whitespace-nowrap">確定の3ステップ</span>
                </strong>
                、レジ待ちの数秒で記録が終わります。
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/"
                  className="neo-btn inline-block bg-primary px-8 py-4 text-lg"
                >
                  今すぐ記録する
                </Link>
                <span className="text-sm font-bold text-muted-foreground">
                  そのままブラウザで開きます
                </span>
              </div>
            </div>
            <KeypadMock />
          </div>
        </section>

        {/* Why it sticks */}
        <section className="border-b-2 border-border bg-muted">
          <div className="container py-14 md:py-20">
            <h2 className="text-3xl font-bold md:text-4xl">
              家計簿が続かないのは、
              <br className="md:hidden" />
              意志ではなく入力の手間のせい。
            </h2>
            <p className="mt-4 max-w-2xl font-medium text-muted-foreground">
              だからサクキロは、分析機能も口座連携もあえて捨てて「記録の速さ」だけを磨きました。
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="neo-border neo-shadow bg-background p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  一般的な家計簿アプリ
                </p>
                <p className="mt-2 text-5xl font-bold">5〜7<span className="text-2xl">ステップ</span></p>
                <p className="mt-3 font-medium text-muted-foreground">
                  起動 → ロード待ち → 入力画面を探す → 金額 → カテゴリ → メモ → 保存
                </p>
              </div>
              <div className="neo-border neo-shadow bg-primary p-6">
                <p className="text-xs font-bold uppercase tracking-widest">サクキロ</p>
                <p className="mt-2 text-5xl font-bold">3<span className="text-2xl">ステップ</span></p>
                <p className="mt-3 font-medium">
                  起動 → 金額入力 → 確定。テンキーは最初から画面に出ています。
                </p>
              </div>
            </div>
            <div className="mt-6 neo-border bg-background p-6 md:flex md:items-center md:gap-6">
              <Zap className="mb-3 h-10 w-10 md:mb-0" strokeWidth={2.5} />
              <div>
                <h3 className="text-xl font-bold">親指一本で完結する「サムゾーン」設計</h3>
                <p className="mt-1 font-medium text-muted-foreground">
                  テンキーと確定ボタンを画面下部の親指の可動域に集約。片手にスマホ、片手にレジ袋でも記録できます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-b-2 border-border">
          <div className="container py-14 md:py-20">
            <h2 className="text-3xl font-bold md:text-4xl">速さのほかに、必要なものだけ。</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <div key={title} className="neo-border neo-shadow-sm bg-background p-6">
                  <Icon className="h-8 w-8" strokeWidth={2.5} />
                  <h3 className="mt-3 text-xl font-bold">{title}</h3>
                  <p className="mt-2 font-medium text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="border-b-2 border-border bg-secondary text-secondary-foreground">
          <div className="container py-14 text-center md:py-20">
            <p className="text-xs font-bold uppercase tracking-widest">料金</p>
            <p className="mt-4 text-7xl font-bold md:text-8xl">¥0</p>
            <p className="mx-auto mt-6 max-w-md font-medium">
              <span className="whitespace-nowrap">無制限の記録</span>、
              <span className="whitespace-nowrap">全通貨</span>、
              <span className="whitespace-nowrap">CSVエクスポート</span>、
              <span className="whitespace-nowrap">ダークモード</span> —
              すべて無料。アプリ内課金も
              <span className="whitespace-nowrap">サブスクリプション</span>
              もありません。
            </p>
          </div>
        </section>

        {/* How to start */}
        <section className="border-b-2 border-border">
          <div className="container py-14 md:py-20">
            <h2 className="text-3xl font-bold md:text-4xl">始め方は、記録と同じく3ステップ。</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {START_STEPS.map(({ num, title, body }) => (
                <div key={num} className="neo-border neo-shadow-sm bg-background p-6">
                  <span className="neo-border inline-flex h-10 w-10 items-center justify-center bg-primary text-xl font-bold">
                    {num}
                  </span>
                  <h3 className="mt-4 text-xl font-bold">{title}</h3>
                  <p className="mt-2 font-medium text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-primary">
          <div className="container py-14 text-center md:py-20">
            <h2 className="text-3xl font-bold md:text-5xl">
              次のレジ待ちが、最初の記録に。
            </h2>
            <Link
              href="/"
              className="neo-btn mt-8 inline-block bg-background px-10 py-5 text-xl"
            >
              サクキロを開く
            </Link>
            <p className="mt-4 flex items-center justify-center gap-2 text-sm font-bold">
              <Smartphone className="h-4 w-4" />
              インストール不要・登録不要・無料
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-border">
        <div className="container flex flex-wrap items-center justify-between gap-2 py-6 text-sm font-bold">
          <span>サクキロ (SAKUKIRO)</span>
          <span className="text-muted-foreground">データはあなたの端末の中だけに。</span>
        </div>
      </footer>
    </div>
  );
}
