import { useEffect } from "react";
import { Link } from "wouter";
import {
  Zap,
  Globe,
  FileSpreadsheet,
  WifiOff,
  Lock,
  Smartphone,
  Delete,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// LP方針:
// - アプリ本体と同一のネオ・ブルータリズム(黒2px罫線 / ハードシャドウ / Safety Orange / 角丸ゼロ)で
//   「LPとアプリが地続き」であることを視覚的に保証し、CTA遷移の心理的コストを下げる。
// - 主張はひとつ:「記録が速いから続く」。速さの証拠として実UIのテンキーを再現して見せる。
// - コピーはLP固有のため共有辞書(LanguageContext)には載せず、言語切替だけを本体と共有する。

const COPY = {
  ja: {
    openApp: "アプリを開く",
    switchTo: "English",
    heroBadge: "無料・登録不要・インストール不要の家計簿PWA",
    ctaPrimary: "今すぐ記録する",
    ctaNote: "そのままブラウザで開きます",
    mockNote: "ランチ",
    mockAmount: "1,280",
    mockUnit: "¥",
    problemTitle: "家計簿が続かないのは、|意志ではなく|入力の手間のせい。",
    problemLead: "だからサクキロは、分析機能も口座連携もあえて捨てて「記録の速さ」だけを磨きました。",
    rivalLabel: "一般的な家計簿アプリ",
    rivalCount: "5〜7",
    rivalFlow: "起動 → ロード待ち → 入力画面を探す → 金額 → カテゴリ → メモ → 保存",
    ownLabel: "サクキロ",
    ownCount: "3",
    ownFlow: "起動 → 金額入力 → 確定。テンキーは最初から画面に出ています。",
    stepUnit: "ステップ",
    thumbTitle: "親指一本で完結する|「サムゾーン」設計",
    thumbBody:
      "テンキーと確定ボタンを画面下部の親指の可動域に集約。片手にスマホ、片手にレジ袋でも記録できます。",
    featuresTitle: "速さのほかに、|必要なものだけ。",
    features: [
      {
        title: "4通貨対応",
        body: "JPY / USD / EUR / CNY を設定から即切り替え。海外旅行や出張の支出もそのまま記録。",
      },
      {
        title: "CSVエクスポート",
        body: "蓄積したデータは標準CSVで出力。集計やグラフ化はExcelやスプレッドシートで自由に。",
      },
      {
        title: "オフライン動作",
        body: "PWAなので機内モードでも起動・記録が可能。電波を待つ時間はありません。",
      },
      {
        title: "データは端末内のみ",
        body: "記録は外部サーバーに一切送信されません。ローカルストレージに保存され、見られるのはあなただけ。",
      },
    ],
    pricingLabel: "料金",
    pricingAmount: "¥0",
    pricingItems: ["無制限の記録", "全通貨", "CSVエクスポート", "ダークモード"],
    pricingSeparator: "、",
    pricingTail: " — すべて無料。アプリ内課金もサブスクリプションもありません。",
    startTitle: "始め方は、|記録と同じく|3ステップ。",
    steps: [
      {
        title: "ブラウザで開く",
        body: "App StoreもGoogle Playも不要。このままブラウザでアプリを開くだけ。",
      },
      {
        title: "ホーム画面に追加",
        body: "共有メニューから「ホーム画面に追加」で、ネイティブアプリと同じ使い心地に。",
      },
      {
        title: "記録する",
        body: "開いた瞬間にテンキー。最初の支出を打ち込めば、もう習慣の始まりです。",
      },
    ],
    finalTitle: "次のレジ待ちが、|最初の記録に。",
    finalCta: "サクキロを開く",
    finalNote: "インストール不要・登録不要・無料",
    footerTagline: "データはあなたの端末の中だけに。",
  },
  en: {
    openApp: "Open app",
    switchTo: "日本語",
    heroBadge: "A free expense-tracking PWA. No signup, no install.",
    ctaPrimary: "Log an expense now",
    ctaNote: "Opens right here in your browser",
    mockNote: "Lunch",
    mockAmount: "12.80",
    mockUnit: "$",
    problemTitle: "You don't quit expense tracking for lack of willpower. You quit because logging takes too long.",
    problemLead:
      "So SAKUKIRO threw out the charts and the bank sync, and sharpened one thing instead: how fast you can log.",
    rivalLabel: "A typical expense app",
    rivalCount: "5–7",
    rivalFlow: "Launch → wait for load → find the entry screen → amount → category → note → save",
    ownLabel: "SAKUKIRO",
    ownCount: "3",
    ownFlow: "Launch → type the amount → confirm. The keypad is on screen from the moment it opens.",
    stepUnit: "steps",
    thumbTitle: "Thumb-zone layout — one hand is enough",
    thumbBody:
      "The keypad and the confirm key sit at the bottom of the screen, inside your thumb's reach. Phone in one hand, grocery bag in the other, and it still works.",
    featuresTitle: "Beyond speed, only what you actually need.",
    features: [
      {
        title: "Four currencies",
        body: "Switch between JPY, USD, EUR and CNY in settings. Works the same way on a trip abroad.",
      },
      {
        title: "CSV export",
        body: "Export everything as standard CSV. Do your totals and charts in Excel or Google Sheets.",
      },
      {
        title: "Works offline",
        body: "It's a PWA, so it launches and records in airplane mode. No waiting for a signal.",
      },
      {
        title: "Data never leaves your device",
        body: "Nothing is sent to a server. Records live in your browser's local storage, and only you can read them.",
      },
    ],
    pricingLabel: "Pricing",
    pricingAmount: "$0",
    pricingItems: ["Unlimited records", "every currency", "CSV export", "dark mode"],
    pricingSeparator: ", ",
    pricingTail: " — all free. No in-app purchases, no subscription.",
    startTitle: "Getting started takes three steps too.",
    steps: [
      {
        title: "Open it in your browser",
        body: "No App Store, no Google Play. Just open the app right here.",
      },
      {
        title: "Add to your home screen",
        body: "Use the share menu to add it to your home screen, and it behaves like a native app.",
      },
      {
        title: "Log something",
        body: "The keypad is waiting the moment it opens. Type your first expense and the habit has started.",
      },
    ],
    finalTitle: "Make your next checkout line the first record.",
    finalCta: "Open SAKUKIRO",
    finalNote: "No install, no signup, free",
    footerTagline: "Your data stays on your device.",
  },
} as const;

const NUMBER_KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "00", "0", "."];

// COPY.features と同じ並び。
const FEATURE_ICONS = [Globe, FileSpreadsheet, WifiOff, Lock];

// 日本語はブラウザが文字単位で折り返すため、見出しが「サムゾー/ン」のように割れる。
// コピー内の "|" を文節境界とみなし、各文節を nowrap で包んでそこだけで改行させる。
// 区切りを含まない文字列(英語)はそのまま返すので通常の折り返しになる。
function Phrased({ text }: { text: string }) {
  if (!text.includes("|")) return <>{text}</>;

  return (
    <>
      {text.split("|").map((phrase, index) => (
        <span key={index} className="whitespace-nowrap">
          {phrase}
        </span>
      ))}
    </>
  );
}

// アプリ本体の入力画面(金額表示 / カテゴリ・備考 / 3列テンキー + 右列の削除・ENTER)を縮約したモック。
function KeypadMock() {
  const { t, language } = useLanguage();
  const copy = COPY[language];

  return (
    <div className="neo-border neo-shadow mx-auto w-full max-w-sm select-none bg-background">
      <div className="border-b-2 border-border p-4">
        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          {t("amount")}
        </span>
        <p className="mt-1 text-right text-5xl font-bold tabular-nums">
          <span className="text-2xl">{copy.mockUnit}</span>
          {copy.mockAmount}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 border-b-2 border-border p-4">
        <span className="neo-border bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
          {t("cat_food")}
        </span>
        <span className="neo-border px-3 py-1 text-xs font-bold text-muted-foreground">
          {copy.mockNote}
        </span>
      </div>
      <div className="grid grid-cols-4">
        <div className="col-span-3 grid grid-cols-3">
          {NUMBER_KEYS.map((key) => (
            <div
              key={key}
              className="flex items-center justify-center border-b-2 border-r-2 border-border py-4 text-2xl font-black"
            >
              {key}
            </div>
          ))}
        </div>
        <div className="col-span-1 grid grid-rows-2">
          <div className="flex items-center justify-center border-b-2 border-border bg-muted/30">
            <Delete className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div className="flex items-center justify-center border-b-2 border-border bg-primary text-sm font-black uppercase tracking-widest text-primary-foreground">
            Enter
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const { language, toggleLanguage } = useLanguage();
  const copy = COPY[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b-2 border-border">
        <div className="container flex items-center justify-between gap-3 py-4">
          <span className="neo-border neo-shadow-sm bg-primary px-3 py-1 text-lg font-bold uppercase tracking-widest text-primary-foreground">
            {language === "ja" ? "サクキロ" : "SAKUKIRO"}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              lang={language === "ja" ? "en" : "ja"}
              className="neo-border whitespace-nowrap px-3 py-2 text-sm font-bold transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {copy.switchTo}
            </button>
            <Link href="/" className="neo-btn whitespace-nowrap bg-background px-4 py-2 text-sm">
              {copy.openApp}
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="border-b-2 border-border">
          <div className="container grid gap-10 py-14 md:py-20 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-4 inline-block border-2 border-border bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-widest text-secondary-foreground">
                {copy.heroBadge}
              </p>
              {language === "ja" ? (
                <>
                  <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                    財布から小銭を
                    <br />
                    出すより、<span className="bg-primary px-2 text-primary-foreground">速い。</span>
                  </h1>
                  <p className="mt-6 max-w-md text-lg font-medium text-muted-foreground">
                    サクキロは開いた瞬間にテンキーが
                    <span className="whitespace-nowrap">立ち上がる</span>
                    <span className="whitespace-nowrap">支出記録アプリ</span>。
                    ロード画面もログインもなし。
                    <strong className="text-foreground">
                      起動→金額入力→<span className="whitespace-nowrap">確定の3ステップ</span>
                    </strong>
                    、レジ待ちの数秒で記録が終わります。
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-pretty text-4xl font-bold leading-tight md:text-6xl">
                    <span className="bg-primary px-2 text-primary-foreground">Faster</span> than
                    digging for coins.
                  </h1>
                  <p className="mt-6 max-w-md text-lg font-medium text-muted-foreground">
                    SAKUKIRO opens straight onto the keypad. No loading screen, no login.{" "}
                    <strong className="text-foreground">
                      Launch, type the amount, confirm — three steps
                    </strong>{" "}
                    that fit in the seconds you spend waiting at the register.
                  </p>
                </>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/"
                  className="neo-btn inline-block bg-primary px-8 py-4 text-lg text-primary-foreground"
                >
                  {copy.ctaPrimary}
                </Link>
                <span className="text-sm font-bold text-muted-foreground">{copy.ctaNote}</span>
              </div>
            </div>
            <KeypadMock />
          </div>
        </section>

        {/* Why it sticks */}
        <section className="border-b-2 border-border bg-muted">
          <div className="container py-14 md:py-20">
            <h2 className="text-pretty text-3xl font-bold md:text-4xl">
              <Phrased text={copy.problemTitle} />
            </h2>
            <p className="mt-4 max-w-2xl font-medium text-muted-foreground">{copy.problemLead}</p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="neo-border neo-shadow bg-background p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {copy.rivalLabel}
                </p>
                <p className="mt-2 text-5xl font-bold">
                  {copy.rivalCount}
                  <span className="ml-1 text-2xl">{copy.stepUnit}</span>
                </p>
                <p className="mt-3 font-medium text-muted-foreground">{copy.rivalFlow}</p>
              </div>
              <div className="neo-border neo-shadow bg-primary p-6 text-primary-foreground">
                <p className="text-xs font-bold uppercase tracking-widest">{copy.ownLabel}</p>
                <p className="mt-2 text-5xl font-bold">
                  {copy.ownCount}
                  <span className="ml-1 text-2xl">{copy.stepUnit}</span>
                </p>
                <p className="mt-3 font-medium">{copy.ownFlow}</p>
              </div>
            </div>
            <div className="neo-border mt-6 bg-background p-6 md:flex md:items-center md:gap-6">
              <Zap className="mb-3 h-10 w-10 shrink-0 md:mb-0" strokeWidth={2.5} />
              <div>
                <h3 className="text-xl font-bold">
                  <Phrased text={copy.thumbTitle} />
                </h3>
                <p className="mt-1 font-medium text-muted-foreground">{copy.thumbBody}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-b-2 border-border">
          <div className="container py-14 md:py-20">
            <h2 className="text-3xl font-bold md:text-4xl">
              <Phrased text={copy.featuresTitle} />
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {copy.features.map(({ title, body }, index) => {
                const Icon = FEATURE_ICONS[index];
                return (
                  <div key={title} className="neo-border neo-shadow-sm bg-background p-6">
                    <Icon className="h-8 w-8" strokeWidth={2.5} />
                    <h3 className="mt-3 text-xl font-bold">{title}</h3>
                    <p className="mt-2 font-medium text-muted-foreground">{body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="border-b-2 border-border bg-secondary text-secondary-foreground">
          <div className="container py-14 text-center md:py-20">
            <p className="text-xs font-bold uppercase tracking-widest">{copy.pricingLabel}</p>
            <p className="mt-4 text-7xl font-bold md:text-8xl">{copy.pricingAmount}</p>
            <p className="mx-auto mt-6 max-w-md font-medium">
              {copy.pricingItems.map((item, index) => (
                <span key={item}>
                  {index > 0 && copy.pricingSeparator}
                  <span className="whitespace-nowrap">{item}</span>
                </span>
              ))}
              {copy.pricingTail}
            </p>
          </div>
        </section>

        {/* How to start */}
        <section className="border-b-2 border-border">
          <div className="container py-14 md:py-20">
            <h2 className="text-3xl font-bold md:text-4xl">
              <Phrased text={copy.startTitle} />
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {copy.steps.map(({ title, body }, index) => (
                <div key={title} className="neo-border neo-shadow-sm bg-background p-6">
                  <span className="neo-border inline-flex h-10 w-10 items-center justify-center bg-primary text-xl font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-xl font-bold">{title}</h3>
                  <p className="mt-2 font-medium text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-primary text-primary-foreground">
          <div className="container py-14 text-center md:py-20">
            <h2 className="text-balance text-3xl font-bold md:text-5xl">
              <Phrased text={copy.finalTitle} />
            </h2>
            <Link href="/" className="neo-btn mt-8 inline-block bg-background px-10 py-5 text-xl text-foreground">
              {copy.finalCta}
            </Link>
            <p className="mt-4 flex items-center justify-center gap-2 text-sm font-bold">
              <Smartphone className="h-4 w-4" />
              {copy.finalNote}
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-border">
        <div className="container flex flex-wrap items-center justify-between gap-2 py-6 text-sm font-bold">
          <span>サクキロ (SAKUKIRO)</span>
          <span className="text-muted-foreground">{copy.footerTagline}</span>
        </div>
      </footer>
    </div>
  );
}
