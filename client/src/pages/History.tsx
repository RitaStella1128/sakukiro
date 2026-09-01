import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Trash2, Download, Edit2, ShoppingBag, Plus } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency, CurrencyCode } from "@/contexts/CurrencyContext";
import { ExportModal } from "@/components/ExportModal";

// UX_RATIONALE:
// - spring_physics: スワイプ操作にバネのような物理挙動を導入し、指への追従性と心地よい反発感を実現。
// - dynamic_feedback: スワイプ量に応じてゴミ箱アイコンのスケールや色を変化させ、削除の閾値を直感的に伝える。
// - layout_animation: 削除後にリストが滑らかに詰まるアニメーションで、空間的な連続性を維持。
// - haptic_feedback: 削除確定の閾値を超えた瞬間に振動フィードバックを与え、操作の確信度を高める。

interface Record {
  id: string;
  amount: number;
  categoryKey?: string;
  category?: string;
  note: string;
  date: string;
  currency?: CurrencyCode;
  unitType?: "money" | "points";
  transactionType?: "expense" | "income";
}

const getRecordUnitType = (record: Record) =>
  record.unitType === "points" ? "points" : "money";

const getRecordUnitCode = (record: Record) =>
  getRecordUnitType(record) === "points" ? "pt" : record.currency || "JPY";

const getRecordTransactionType = (record: Record) =>
  record.transactionType === "income" ? "income" : "expense";

type SummaryBucket = {
  key: string;
  unitType: "money" | "points";
  currency?: CurrencyCode;
  income: number;
  expense: number;
};

function formatUnitAmount(
  amount: number,
  unitType: "money" | "points",
  currency: CurrencyCode | undefined,
  availableCurrencies: any,
) {
  if (unitType === "points") {
    return `${amount.toLocaleString()} pt`;
  }

  const currencyCode = currency || "JPY";
  const currencyConfig = availableCurrencies[currencyCode] || availableCurrencies["JPY"];

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: currencyConfig.decimals,
    maximumFractionDigits: currencyConfig.decimals,
  }).format(amount);
}

function formatSignedUnitAmount(
  amount: number,
  unitType: "money" | "points",
  currency: CurrencyCode | undefined,
  availableCurrencies: any,
) {
  const sign = amount > 0 ? "+" : amount < 0 ? "−" : "";
  return `${sign}${formatUnitAmount(Math.abs(amount), unitType, currency, availableCurrencies)}`;
}

function formatRecordAmount(record: Record, availableCurrencies: any) {
  const sign = getRecordTransactionType(record) === "income" ? "+" : "−";

  if (getRecordUnitType(record) === "points") {
    return `${sign}${record.amount.toLocaleString()} pt`;
  }

  const currencyCode = record.currency || "JPY";
  const currencyConfig = availableCurrencies[currencyCode] || availableCurrencies["JPY"];

  const formattedAmount = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: currencyConfig.decimals,
    maximumFractionDigits: currencyConfig.decimals,
  }).format(record.amount);

  return `${sign}${formattedAmount}`;
}

// Swipeable Item Component with Advanced Physics
function HistoryItem({ 
  record, 
  index, 
  onDelete, 
  onEdit,
  t, 
  formatDate, 
  availableCurrencies 
}: { 
  record: Record; 
  index: number; 
  onDelete: (id: string) => void; 
  onEdit: (id: string) => void;
  t: (key: string) => string; 
  formatDate: (date: string) => string;
  availableCurrencies: any;
}) {
  // Motion values for swipe gesture
  const x = useMotionValue(0);
  
  // Dynamic transformations based on swipe distance
  const deleteThreshold = -100;
  const bgOpacity = useTransform(x, [0, -50, -100], [0, 0.5, 1]);
  const iconScale = useTransform(x, [-50, -100, -150], [0.8, 1.2, 1.5]);
  const iconColor = useTransform(x, [-80, -100], ["#ffffff", "#ff0000"]); // White to Red
  
  // Track if threshold was crossed to trigger haptic once
  const [crossedThreshold, setCrossedThreshold] = useState(false);

  useEffect(() => {
    const unsubscribe = x.on("change", (latest) => {
      if (latest < deleteThreshold && !crossedThreshold) {
        setCrossedThreshold(true);
        if (navigator.vibrate) navigator.vibrate(15); // Light tick
      } else if (latest >= deleteThreshold && crossedThreshold) {
        setCrossedThreshold(false);
      }
    });
    return () => unsubscribe();
  }, [x, crossedThreshold]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < deleteThreshold || info.velocity.x < -500) {
      // Trigger delete with velocity or distance
      onDelete(record.id);
    } else {
      // Reset is handled by dragConstraints
    }
  };

  return (
    <motion.div
      layout // Enable layout animation for smooth list reordering
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ 
        opacity: 0, 
        height: 0, 
        marginBottom: 0, 
        x: -300, 
        transition: { 
          opacity: { duration: 0.2 },
          x: { duration: 0.2 },
          height: { duration: 0.3, delay: 0.1 },
          marginBottom: { duration: 0.3, delay: 0.1 }
        } 
      }}
      transition={{ delay: index * 0.05 }}
      className="relative mb-3"
    >
      {/* Background Layer (Delete Action) */}
      <motion.div 
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-destructive flex items-center justify-end px-6 rounded-none"
      >
        <motion.div style={{ scale: iconScale, color: iconColor }}>
          <Trash2 className="w-6 h-6 text-destructive-foreground" strokeWidth={2.5} />
        </motion.div>
      </motion.div>

      {/* Foreground Layer (Content) */}
      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.5, right: 0.05 }} // Stiffer right resistance
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.02, cursor: "grabbing" }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onEdit(record.id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onEdit(record.id);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${t("editRecord")}: ${formatRecordAmount(record, availableCurrencies)}`}
        className="relative neo-border bg-white dark:bg-black p-4 flex justify-between items-center touch-pan-y cursor-pointer select-none"
      >
        <div className="flex flex-col gap-1 overflow-hidden pointer-events-none">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tighter">
              {formatRecordAmount(record, availableCurrencies)}
            </span>
            <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 border border-black dark:border-white ${
              getRecordTransactionType(record) === "income"
                ? "bg-green-600 text-white"
                : "bg-black text-white dark:bg-white dark:text-black"
            }`}>
              {t(getRecordTransactionType(record))}
            </span>
            <span className="text-[10px] font-black uppercase bg-primary text-primary-foreground px-1.5 py-0.5 border border-black dark:border-white">
              {record.categoryKey ? t(record.categoryKey) : record.category}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {formatDate(record.date)}
            </span>
            {record.note && (
              <span className="text-sm font-bold mt-1 truncate">
                {record.note}
              </span>
            )}
          </div>
        </div>
        
        {/* Visual indicator for swipe/edit */}
        <div className="flex flex-col items-end gap-2 pl-2 text-muted-foreground/20">
          <Edit2 className="w-4 h-4" strokeWidth={3} />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HistoryPage() {
  const { t, formatDate } = useLanguage();
  const { availableCurrencies } = useCurrency();
  const [records, setRecords] = useState<Record[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [_, setLocation] = useLocation();

  const summaries = useMemo<SummaryBucket[]>(() => {
    const summaryMap = new Map<string, SummaryBucket>();

    records.forEach((record) => {
      const unitType = getRecordUnitType(record);
      const currency = unitType === "money" ? record.currency || "JPY" : undefined;
      const unitCode = unitType === "points" ? "pt" : currency;
      const key = `${unitType}:${unitCode}`;
      const current = summaryMap.get(key) || {
        key,
        unitType,
        currency,
        income: 0,
        expense: 0,
      };

      if (getRecordTransactionType(record) === "income") {
        current.income += record.amount;
      } else {
        current.expense += record.amount;
      }

      summaryMap.set(key, current);
    });

    return Array.from(summaryMap.values());
  }, [records]);

  useEffect(() => {
    const storedData = localStorage.getItem("kaimono_records");
    if (storedData) {
      setRecords(JSON.parse(storedData));
    }

    // Check tutorial status
    const hasSeenTutorial = localStorage.getItem("kaimono_swipe_tutorial_seen");
    if (!hasSeenTutorial && storedData && JSON.parse(storedData).length > 0) {
      setShowTutorial(true);
      // Auto dismiss after 3 seconds
      setTimeout(() => {
        setShowTutorial(false);
        localStorage.setItem("kaimono_swipe_tutorial_seen", "true");
      }, 3000);
    }
  }, []);

  const handleDelete = (id: string) => {
    const newRecords = records.filter((r) => r.id !== id);
    setRecords(newRecords);
    localStorage.setItem("kaimono_records", JSON.stringify(newRecords));
    // Stronger haptic feedback on delete
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
  };

  const handleExportClick = () => {
    if (records.length === 0) {
      toast.error(t("noRecords"));
      return;
    }
    setShowExportModal(true);
  };

  const handleExportConfirm = () => {
    const headers = ["Date", "Amount", "Transaction Type", "Unit Type", "Unit", "Category", "Note"];
    const rows = records.map(record => {
      const date = new Date(record.date).toLocaleString();
      const category = record.categoryKey ? t(record.categoryKey) : record.category;
      const note = record.note ? `"${record.note.replace(/"/g, '""')}"` : "";
      const unitType = getRecordUnitType(record);
      const unitCode = getRecordUnitCode(record);
      
      return [
        date,
        record.amount,
        getRecordTransactionType(record),
        unitType,
        unitCode,
        category,
        note
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `kaimono_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowExportModal(false);
  };

  const handleEdit = (id: string) => {
    setLocation(`/edit/${id}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen flex flex-col bg-background text-foreground font-sans"
    >
      {/* Header */}
      <header className="flex items-center px-4 py-3 border-b-2 border-black dark:border-white bg-white dark:bg-black sticky top-0 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setLocation("/")}
          className="mr-2 w-10 h-10 rounded-none border-2 border-black dark:border-white hover:bg-accent hover:text-accent-foreground transition-all active:translate-x-[-2px]"
          aria-label={t("back")}
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
        </Button>
        <h1 className="text-lg font-black tracking-tighter uppercase flex-1">{t("history")}</h1>
        {records.length > 0 && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleExportClick}
            className="w-10 h-10 rounded-none border-2 border-black dark:border-white hover:bg-accent hover:text-accent-foreground transition-all active:translate-y-1"
            aria-label={t("export")}
            title={t("export")}
          >
            <Download className="w-6 h-6" strokeWidth={2.5} />
          </Button>
        )}
      </header>

      <ExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
        onConfirm={handleExportConfirm} 
      />

      <main className="flex-1 max-w-md mx-auto w-full p-4 overflow-x-hidden relative">
        {records.length > 0 && (
          <section aria-labelledby="history-summary-title" className="mb-4 space-y-2">
            <div className="flex items-center justify-between">
              <h2 id="history-summary-title" className="text-xs font-black uppercase tracking-widest">
                {t("summary")}
              </h2>
              <span className="text-[10px] font-bold text-muted-foreground">
                {records.length} {t("recordsCount")}
              </span>
            </div>
            <div className="grid gap-2">
              {summaries.map((summary) => {
                const balance = summary.income - summary.expense;
                const unitLabel = summary.unitType === "points" ? t("points") : summary.currency;

                return (
                  <div key={summary.key} className="neo-border bg-white dark:bg-black p-3">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="text-sm font-black uppercase">{unitLabel}</span>
                      <span className="text-xs font-bold">
                        {t("balance")}: <strong className={balance >= 0 ? "text-green-600" : "text-destructive"}>
                          {formatSignedUnitAmount(balance, summary.unitType, summary.currency, availableCurrencies)}
                        </strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      <div className="border-2 border-green-600/40 p-2">
                        <span className="text-muted-foreground">{t("income")}</span>
                        <span className="block text-sm text-green-600">
                          +{formatUnitAmount(summary.income, summary.unitType, summary.currency, availableCurrencies)}
                        </span>
                      </div>
                      <div className="border-2 border-destructive/40 p-2">
                        <span className="text-muted-foreground">{t("expense")}</span>
                        <span className="block text-sm text-destructive">
                          −{formatUnitAmount(summary.expense, summary.unitType, summary.currency, availableCurrencies)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Tutorial Overlay */}
        <AnimatePresence>
          {showTutorial && records.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 pointer-events-none flex items-start justify-center pt-12"
            >
              <div className="bg-black/80 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
                <motion.div
                  animate={{ x: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  ←
                </motion.div>
                {t("swipeToDelete")}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {records.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 text-muted-foreground"
            >
              <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-bold">{t("noRecords")}</p>
              <Button
                onClick={() => setLocation("/")}
                className="mt-4 rounded-none border-2 border-black dark:border-white font-black"
              >
                <Plus className="w-4 h-4" strokeWidth={3} />
                {t("addFirstRecord")}
              </Button>
            </motion.div>
          ) : (
            records.map((record, index) => (
              <HistoryItem 
                key={record.id} 
                record={record} 
                index={index} 
                onDelete={handleDelete}
                onEdit={handleEdit}
                t={t}
                formatDate={formatDate}
                availableCurrencies={availableCurrencies}
              />
            ))
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
