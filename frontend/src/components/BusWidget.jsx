import { useState, useEffect } from "react";

// 120: Primaria Vulcan → Stad. Municipal
const LINE_120_THERE = {
  weekday: [
    [5,33],[6,45],[7,57],[11,9],[12,21],[13,33],
    [15,10],[16,25],[17,40],[18,55],[20,10],[21,22]
  ],
  weekend: [[9,0],[11,9],[16,25],[18,20]]
};

// 120: Stad. Municipal → Primaria Vulcan
const LINE_120_BACK = {
  weekday: [
    [5,3],[6,15],[7,27],[10,40],[11,52],[13,4],
    [14,40],[15,55],[17,10],[18,25],[19,40],[20,52]
  ],
  weekend: [[8,30],[10,40],[15,55],[17,50]]
};

// 9: Stad. Municipal → Rulmentul
const LINE_9_THERE = {
  weekday: [
    [6,0],[6,15],[6,30],[6,45],
    [7,0],[7,15],[7,35],[7,45],[7,55],
    [8,10],[8,25],[8,45],
    [9,20],[9,56],[10,30],
    [11,0],[11,30],[12,0],[12,30],
    [13,0],[13,18],[13,36],[13,54],
    [14,12],[14,30],[14,45],
    [15,5],[15,23],[15,40],[15,55],
    [16,15],[16,38],[16,50],
    [17,5],[17,35],[18,5],[18,35],
    [19,5],[19,35],[20,5],[20,35],
    [21,5],[21,35],[22,5],[22,35]
  ],
  weekend: [
    [6,30],[7,0],[7,30],[8,8],[8,38],
    [9,0],[9,30],[10,0],[10,30],
    [11,0],[11,30],[12,0],[12,30],
    [13,0],[13,30],[14,0],[14,30],
    [15,0],[15,30],[16,0],[16,30],
    [17,8],[17,38],[18,0],[18,30],
    [19,0],[19,30],[20,0],[20,30],
    [21,0],[21,30],[22,0],[22,30]
  ]
};

// 9: Rulmentul → Stad. Municipal
const LINE_9_BACK = {
  weekday: [
    [5,30],[5,45],
    [6,0],[6,15],[6,30],[6,45],
    [7,5],[7,15],[7,25],[7,35],[7,50],
    [8,5],[8,23],[8,51],[9,32],
    [10,0],[10,30],[11,0],[11,30],
    [12,0],[12,30],
    [13,0],[13,35],[13,55],
    [14,10],[14,30],[14,48],
    [15,5],[15,20],[15,40],[15,58],
    [16,15],[16,30],[16,50],
    [17,10],[17,30],[18,5],[18,35],
    [19,5],[19,35],[20,5],[20,35],
    [21,5],[21,35],[22,5],[22,35],[23,5]
  ],
  weekend: [
    [6,30],[7,0],[7,30],[8,0],[8,33],
    [9,3],[9,30],[10,0],[10,30],
    [11,0],[11,30],[12,0],[12,30],
    [13,0],[13,30],[14,0],[14,30],
    [15,0],[15,30],[16,0],[16,30],
    [17,0],[17,33],[18,3],[18,30],
    [19,0],[19,30],[20,0],[20,30],
    [21,0],[21,30],[22,0],[22,30]
  ]
};

function formatTime([h, m]) {
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}

function getNextDepartures(schedule, now, count = 3) {
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;
  const times = isWeekend ? schedule.weekend : schedule.weekday;
  const cur = now.getHours() * 60 + now.getMinutes();
  return times
    .map(([h, m]) => ({ h, m, total: h * 60 + m }))
    .filter(t => t.total > cur)
    .slice(0, count)
    .map(t => ({
      time: formatTime([t.h, t.m]),
      diff: t.total - cur
    }));
}

function formatDiff(diff) {
  if (diff <= 0) return "сейчас";
  if (diff < 60) return `через ${diff} мин`;
  return `через ${Math.floor(diff/60)}ч ${diff%60}м`;
}

// Модальное окно с полным расписанием
function ScheduleModal({ onClose, goingBack, isWeekend, now }) {
  const cur = now.getHours() * 60 + now.getMinutes();

  const schedule120 = goingBack ? LINE_120_BACK : LINE_120_THERE;
  const schedule9 = goingBack ? LINE_9_BACK : LINE_9_THERE;
  const times120 = isWeekend ? schedule120.weekend : schedule120.weekday;
  const times9 = isWeekend ? schedule9.weekend : schedule9.weekday;

  const direction120 = goingBack ? "Stad. Municipal → Primaria Vulcan" : "Primaria Vulcan → Stad. Municipal";
  const direction9 = goingBack ? "Rulmentul → Stad. Municipal" : "Stad. Municipal → Rulmentul";

  return (
    <div style={modal.overlay} onClick={onClose}>
      <div style={modal.box} onClick={e => e.stopPropagation()}>
        <div style={modal.header}>
          <span style={modal.title}>📋 Полное расписание</span>
          <button onClick={onClose} style={modal.closeBtn}>✕</button>
        </div>
        <div style={modal.subtitle}>
          {isWeekend ? "Суббота · Воскресенье" : "Пн – Пт"} · {goingBack ? "← Домой" : "→ В город"}
        </div>

        <FullScheduleBlock
          number="120"
          color="#6366f1"
          direction={direction120}
          times={times120}
          cur={cur}
        />

        <div style={modal.divider} />

        <FullScheduleBlock
          number="9"
          color="#f472b6"
          direction={direction9}
          times={times9}
          cur={cur}
        />
      </div>
    </div>
  );
}

function FullScheduleBlock({ number, color, direction, times, cur }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ ...styles.badge, background: color }}>{number}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#3b3b5c" }}>{direction}</span>
      </div>
      <div style={modal.grid}>
        {times.map(([h, m], i) => {
          const total = h * 60 + m;
          const isPast = total <= cur;
          const isNext = !isPast && times.slice(0, i).every(([hh, mm]) => hh * 60 + mm <= cur);
          return (
            <div
              key={i}
              style={{
                ...modal.timeCell,
                color: isPast ? "#d1d5db" : isNext ? color : "#3b3b5c",
                background: isNext ? color + "15" : "transparent",
                border: isNext ? `1.5px solid ${color}40` : "1.5px solid transparent",
                fontWeight: isNext ? 800 : isPast ? 400 : 600,
                textDecoration: isPast ? "line-through" : "none",
              }}
            >
              {formatTime([h, m])}
              {isNext && <span style={{ fontSize: 8, marginTop: 2, color }}>▶</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BusWidget() {
  const [now, setNow] = useState(new Date());
  const [goingBack, setGoingBack] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const isWeekend = now.getDay() === 0 || now.getDay() === 6;
  const timeStr = now.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
  const next120 = getNextDepartures(goingBack ? LINE_120_BACK : LINE_120_THERE, now);
  const next9 = getNextDepartures(goingBack ? LINE_9_BACK : LINE_9_THERE, now);

  return (
    <>
      {showSchedule && (
        <ScheduleModal
          onClose={() => setShowSchedule(false)}
          goingBack={goingBack}
          isWeekend={isWeekend}
          now={now}
        />
      )}

      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <span style={{fontSize:22}}>🚌</span>
            <div>
              <div style={styles.title}>Автобус</div>
              <div style={styles.subtitle}>
                {isWeekend ? "Суббота · Воскресенье" : "Пн · Пт"} · сейчас {timeStr}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setShowSchedule(true)} style={styles.scheduleBtn}>
              📋
            </button>
            <button onClick={() => setGoingBack(!goingBack)} style={styles.toggleBtn}>
              {goingBack ? "🏠 Домой" : "🏟 Туда"}
            </button>
          </div>
        </div>

        <div style={styles.directionLabel}>
          {goingBack ? "← Обратно домой" : "→ Поездка в город"}
        </div>

        <BusLine
          number="120"
          color="#6366f1"
          direction={goingBack ? "Stad. Municipal → Primaria Vulcan" : "Primaria Vulcan → Stad. Municipal"}
          departures={next120}
        />

        <div style={styles.divider} />

        <BusLine
          number="9"
          color="#f472b6"
          direction={goingBack ? "Rulmentul → Stad. Municipal" : "Stad. Municipal → Rulmentul"}
          departures={next9}
        />
      </div>
    </>
  );
}

function BusLine({ number, color, direction, departures }) {
  return (
    <div style={{marginBottom: 4}}>
      <div style={styles.lineHeader}>
        <span style={{...styles.badge, background: color}}>{number}</span>
        <div style={styles.lineDirection}>{direction}</div>
      </div>
      {departures.length === 0 ? (
        <div style={styles.noMore}>Автобусов больше нет сегодня 🌙</div>
      ) : (
        <div style={styles.departures}>
          {departures.map((d, i) => (
            <div key={i} style={{...styles.departure, opacity: i === 0 ? 1 : 0.55}}>
              <span style={{...styles.depTime, color: i === 0 ? color : "#9ca3af"}}>{d.time}</span>
              {i === 0
                ? <span style={{...styles.pill, background: color+"22", color}}>⏱ {formatDiff(d.diff)}</span>
                : <span style={styles.diffGray}>{formatDiff(d.diff)}</span>
              }
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: "rgba(255,255,255,0.75)",
    border: "1px solid rgba(255,255,255,0.95)",
    borderRadius: 20,
    boxShadow: "0 2px 12px rgba(149,157,220,0.12)",
    backdropFilter: "blur(10px)",
    padding: 16,
    marginTop: 32,
    fontFamily: "'Nunito', sans-serif"
  },
  header: { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 },
  headerLeft: { display:"flex", alignItems:"center", gap:10 },
  title: { fontSize:14, fontWeight:800, color:"#3b3b5c", textTransform:"uppercase", letterSpacing:"0.06em" },
  subtitle: { fontSize:11, color:"#9ca3af", fontWeight:600, marginTop:1 },
  toggleBtn: {
    background: "rgba(165,180,252,0.15)",
    border: "none", borderRadius:12,
    padding: "6px 12px", fontSize:12, fontWeight:700,
    color: "#6366f1", cursor:"pointer",
    fontFamily: "'Nunito', sans-serif", flexShrink:0
  },
  scheduleBtn: {
    background: "rgba(165,180,252,0.15)",
    border: "none", borderRadius:12,
    padding: "6px 10px", fontSize:14,
    cursor:"pointer", flexShrink:0
  },
  directionLabel: { fontSize:11, fontWeight:700, color:"#a5b4fc", marginBottom:12, letterSpacing:"0.04em" },
  lineHeader: { display:"flex", alignItems:"center", gap:10, marginBottom:8 },
  badge: { color:"white", fontWeight:800, fontSize:13, borderRadius:8, padding:"3px 9px", flexShrink:0 },
  lineDirection: { fontSize:12, fontWeight:700, color:"#3b3b5c" },
  departures: { display:"flex", flexDirection:"column", gap:4, paddingLeft:4 },
  departure: { display:"flex", alignItems:"center", justifyContent:"space-between" },
  depTime: { fontSize:18, fontWeight:800 },
  pill: { padding:"3px 10px", borderRadius:99, fontWeight:700, fontSize:12 },
  diffGray: { color:"#c4c9e2", fontWeight:600, fontSize:12 },
  divider: { height:1, background:"rgba(199,210,254,0.3)", margin:"12px 0" },
  noMore: { color:"#c4c9e2", fontSize:13, fontWeight:600, textAlign:"center", padding:"8px 0" }
};

const modal = {
  overlay: {
    position: "fixed", top:0, left:0, width:"100%", height:"100%",
    background: "rgba(45,45,58,0.4)",
    backdropFilter: "blur(6px)",
    zIndex: 1000,
    display: "flex", alignItems: "flex-end", justifyContent: "center",
  },
  box: {
    background: "rgba(255,255,255,0.97)",
    borderRadius: "24px 24px 0 0",
    padding: "20px 20px 40px",
    width: "100%",
    maxWidth: 480,
    maxHeight: "85vh",
    overflowY: "auto",
    fontFamily: "'Nunito', sans-serif",
    boxShadow: "0 -8px 40px rgba(149,157,220,0.25)",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 4,
  },
  title: { fontSize:16, fontWeight:800, color:"#3b3b5c" },
  subtitle: { fontSize:12, color:"#9ca3af", fontWeight:600, marginBottom:16 },
  closeBtn: {
    background: "rgba(199,210,254,0.3)",
    border: "none", borderRadius:10,
    width:32, height:32,
    fontSize:14, cursor:"pointer",
    display:"flex", alignItems:"center", justifyContent:"center",
    color:"#9ca3af", fontWeight:700,
  },
  divider: { height:1, background:"rgba(199,210,254,0.4)", margin:"16px 0" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 6,
  },
  timeCell: {
    padding: "6px 4px",
    borderRadius: 10,
    fontSize: 13,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "all 0.15s",
  }
};
