import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Constants ─── */
const STEPS = [
  "preview",
  "value_prop",
  "basic_info",
  "verify_select",
  "photo_upload",
  "personality",
  "match_card",
  "wave_detail",
  "meeting_policy",
  "complete",
];

const PURPLE = {
  50: "#f5f0ff",
  100: "#ede0f8",
  200: "#d8c4f0",
  300: "#c084e0",
  400: "#a878d0",
  500: "#9b6dd7",
  600: "#7c4fbf",
  700: "#5e3a9e",
  800: "#3d2570",
  900: "#1a0e2e",
  glow: "rgba(124,79,191,0.35)",
};

/* ─── Shared UI Components ─── */
function Btn({ children, onClick, variant = "primary", disabled, style = {} }) {
  const base = {
    width: "100%",
    padding: "15px",
    borderRadius: 14,
    border: "none",
    fontSize: 15,
    fontWeight: 700,
    cursor: disabled ? "default" : "pointer",
    transition: "all 0.3s ease",
    letterSpacing: "0.01em",
    ...style,
  };
  const variants = {
    primary: {
      background: disabled
        ? "rgba(255,255,255,0.06)"
        : `linear-gradient(135deg, ${PURPLE[500]}, ${PURPLE[600]})`,
      color: disabled ? "rgba(255,255,255,0.25)" : "#fff",
      boxShadow: disabled ? "none" : `0 4px 24px ${PURPLE.glow}`,
    },
    ghost: {
      background: "none",
      color: "rgba(255,255,255,0.35)",
      fontSize: 13,
      padding: "8px 0",
    },
    secondary: {
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "rgba(255,255,255,0.6)",
    },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 13, color: PURPLE[300], fontWeight: 600, letterSpacing: "0.08em", marginBottom: 8 }}>
      {children}
    </div>
  );
}

function Heading({ children, sub }) {
  return (
    <div>
      <h2 style={{ fontSize: 21, fontWeight: 700, color: PURPLE[100], margin: 0, lineHeight: 1.4 }}>{children}</h2>
      {sub && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "8px 0 0", lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

function UnlockBadge({ icon, title, desc }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: 14,
        background: `linear-gradient(135deg, rgba(155,109,215,0.1), rgba(192,132,224,0.05))`,
        border: `1px solid rgba(155,109,215,0.2)`,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: PURPLE[200] }}>{title}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{desc}</div>
      </div>
    </div>
  );
}

function StepProgress({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 5, justifyContent: "center", padding: "14px 0" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 24 : 7,
            height: 7,
            borderRadius: 4,
            background: i === current ? `linear-gradient(90deg, ${PURPLE[500]}, ${PURPLE[300]})` : i < current ? PURPLE[500] : "rgba(255,255,255,0.12)",
            transition: "all 0.4s ease",
          }}
        />
      ))}
    </div>
  );
}

/* ─── STEP 0: Preview ─── */
function PreviewStep({ onNext, onSkip }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, padding: "16px 0" }}>
      <div style={{ textAlign: "center" }}>
        <SectionLabel>결하다가 제안하는 만남</SectionLabel>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: PURPLE[100], margin: "4px 0 0", lineHeight: 1.45 }}>
          선불 부담 없이,<br />억지 대화 없이,<br />결이 맞는 사람과.
        </h2>
      </div>

      {/* Blurred sample card */}
      <div style={{ width: "100%", background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 18, border: "1px solid rgba(255,255,255,0.08)", position: "relative" }}>
        <div style={{ width: "100%", height: 180, borderRadius: 14, background: "linear-gradient(135deg, #7c5cbf, #b88fd0, #d4a8e0)", filter: "blur(14px)", marginBottom: 14, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", filter: "none", zIndex: 2 }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="3" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" /><path d="M7 11V7a5 5 0 0110 0v4" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 90, height: 16, borderRadius: 8, background: "rgba(255,255,255,0.1)", filter: "blur(4px)" }} />
          <div style={{ width: 50, height: 16, borderRadius: 8, background: "rgba(255,255,255,0.07)", filter: "blur(4px)" }} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["외모", "직업", "성격", "가치관", "라이프", "재정"].map((t) => (
            <span key={t} style={{ padding: "5px 11px", borderRadius: 16, fontSize: 11, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.06)" }}>{t}</span>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "8px 16px", borderRadius: 20, background: "rgba(15,10,26,0.85)", backdropFilter: "blur(8px)", fontSize: 12, color: PURPLE[200], fontWeight: 600 }}>
            프로필을 완성하면 이 카드가 열려요
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
        {[
          { icon: "💜", text: "외면의 결 + 내면의 결 매칭" },
          { icon: "📅", text: "억지 대화 없이 바로 만남 시간 확정" },
          { icon: "🔒", text: "입력한 만큼 상대 정보도 정확하게 공개" },
        ].map((v, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontSize: 18 }}>{v.icon}</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{v.text}</span>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>기본 가입 1분 · 정밀 결맞춤 5분</div>

      <Btn onClick={onNext}>어떤 정보를 받을 수 있는지 보기</Btn>
      <Btn variant="ghost" onClick={onSkip}>건너뛰고 바로 시작 →</Btn>
    </div>
  );
}

/* ─── STEP 1: Value Prop ─── */
function ValuePropStep({ onNext }) {
  const [revealLevel, setRevealLevel] = useState(0);
  useEffect(() => {
    const timers = Array.from({ length: 6 }, (_, i) => setTimeout(() => setRevealLevel(i + 1), 500 * (i + 1)));
    return () => timers.forEach(clearTimeout);
  }, []);

  const items = [
    { icon: "👤", label: "기본 정보", value: "32세 · 서울 강남구" },
    { icon: "💼", label: "직업 정보", value: "IT기업 · 대기업 (상호 호감 후 사명 공개)" },
    { icon: "🎓", label: "학력", value: "서울 소재 4년제 · 경영학" },
    { icon: "💰", label: "재정 수준", value: "연소득 상위 20%" },
    { icon: "🌊", label: "성격 파동", value: "다이나믹 듀오 — 대화 텐션이 잘 맞는 편" },
    { icon: "✨", label: "결맞춤 점수", value: "87점 — 생활 리듬과 감정 호흡이 유사해요" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "16px 0" }}>
      <div style={{ textAlign: "center" }}>
        <SectionLabel>당신이 제공하면, 상대방도 제공해요</SectionLabel>
        <Heading>정보를 입력할수록{"\n"}상대방 카드가 열려요</Heading>
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 18, padding: 16, border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {["외모", "직업", "성격", "가치관", "라이프", "재정"].map((tag, i) => (
            <div key={tag} style={{ padding: "5px 11px", borderRadius: 16, fontSize: 11, fontWeight: 500, background: revealLevel > i ? `linear-gradient(135deg, ${PURPLE[500]}, ${PURPLE[300]})` : "rgba(255,255,255,0.06)", color: revealLevel > i ? "#fff" : "rgba(255,255,255,0.25)", border: `1px solid ${revealLevel > i ? "transparent" : "rgba(255,255,255,0.08)"}`, transition: "all 0.5s ease" }}>{tag}</div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {items.map((item, idx) => (
            <RevealLine key={idx} {...item} active={revealLevel > idx} />
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 16px", borderRadius: 14, background: "rgba(155,109,215,0.08)", border: "1px solid rgba(155,109,215,0.15)", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 22 }}>📅</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: PURPLE[200] }}>대화 없이 바로 만남 확정</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>내가 원하는 시간을 선택하면 앱이 장소까지 잡아줘요</div>
        </div>
      </div>

      <Btn onClick={onNext}>프로필 만들기 시작</Btn>
    </div>
  );
}

function RevealLine({ icon, label, value, active }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, background: active ? "rgba(155,109,215,0.1)" : "rgba(255,255,255,0.02)", border: `1px solid ${active ? "rgba(155,109,215,0.2)" : "rgba(255,255,255,0.04)"}`, opacity: active ? 1 : 0.35, transform: active ? "translateX(0)" : "translateX(-6px)", transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)" }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em" }}>{label}</div>
        <div style={{ fontSize: 13, color: active ? PURPLE[200] : "rgba(255,255,255,0.2)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{active ? value : "● ● ● ●"}</div>
      </div>
      {active && (
        <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8" fill="rgba(155,109,215,0.25)" /><path d="M5.5 9l2.5 2.5 4.5-4.5" stroke={PURPLE[300]} strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
      )}
    </div>
  );
}

/* ─── STEP 2: Basic Info ─── */
function BasicInfoStep({ onNext }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "16px 0" }}>
      <div>
        <SectionLabel>STEP 1 · 기본 정보</SectionLabel>
        <Heading sub="기본 정보만으로도 매칭을 시작할 수 있어요. 추가 인증은 나중에 해도 돼요.">1분이면 충분해요</Heading>
      </div>
      {[
        { label: "이름", ph: "실명을 입력해주세요" },
        { label: "생년월일", ph: "YYYY-MM-DD" },
        { label: "성별", ph: "선택해주세요" },
        { label: "거주 지역", ph: "시/구 선택" },
      ].map((f, i) => (
        <div key={i}>
          <label style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, display: "block", marginBottom: 5 }}>{f.label}</label>
          <div style={{ padding: "13px 15px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.25)", fontSize: 14 }}>{f.ph}</div>
        </div>
      ))}
      <UnlockBadge icon="🔓" title="이 단계 완료 시 잠금해제" desc="상대방의 기본 프로필 + 대표 사진 1장" />
      <Btn onClick={onNext}>다음</Btn>
    </div>
  );
}

/* ─── STEP 3: Verify Select ─── */
function VerifySelectStep({ onNext, verifications, setVerifications }) {
  const toggle = (key) => setVerifications((v) => ({ ...v, [key]: !v[key] }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "16px 0" }}>
      <div>
        <SectionLabel>STEP 2 · 인증 선택</SectionLabel>
        <Heading sub="추가 인증을 할수록 상대방의 더 자세한 정보를 볼 수 있어요. 나중에 언제든 추가 가능해요.">필수 인증 2개면 시작 가능</Heading>
      </div>

      <div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>필수 인증</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <VerifyRow icon="🪪" title="본인 인증" sub="실명 및 나이 확인" required checked />
          <VerifyRow icon="📱" title="휴대폰 인증" sub="본인 명의 번호 확인" required checked />
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>선택 인증 — 할수록 상대 정보가 더 열려요</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <VerifyRow icon="💼" title="직장 인증" sub="업종·규모 공개 (사명은 상호 호감 후)" checked={verifications.job} onToggle={() => toggle("job")} />
          <VerifyRow icon="🎓" title="학력 인증" sub="졸업증명서 또는 학위증" checked={verifications.edu} onToggle={() => toggle("edu")} />
          <VerifyRow icon="💰" title="소득 인증" sub="소득금액증명 또는 원천징수영수증" checked={verifications.income} onToggle={() => toggle("income")} />
        </div>
      </div>

      <div style={{ padding: "14px 16px", borderRadius: 14, background: "linear-gradient(135deg, rgba(155,109,215,0.1), rgba(192,132,224,0.05))", border: "1px solid rgba(155,109,215,0.2)" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: PURPLE[200], marginBottom: 10 }}>🔓 현재 선택으로 열리는 정보</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {[
            { label: "기본 프로필", on: true },
            { label: "대표 사진", on: true },
            { label: "직업 상세", on: verifications.job },
            { label: "학력 상세", on: verifications.edu },
            { label: "소득 수준", on: verifications.income },
          ].map((item, i) => (
            <span key={i} style={{ padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 500, background: item.on ? "rgba(155,109,215,0.18)" : "rgba(255,255,255,0.04)", color: item.on ? PURPLE[200] : "rgba(255,255,255,0.2)", border: `1px solid ${item.on ? "rgba(155,109,215,0.25)" : "rgba(255,255,255,0.05)"}`, transition: "all 0.3s ease" }}>
              {item.on ? "✓ " : ""}{item.label}
            </span>
          ))}
        </div>
      </div>

      <Btn onClick={onNext}>인증하고 다음으로</Btn>
      <Btn variant="ghost" onClick={onNext}>나중에 인증하기 →</Btn>
    </div>
  );
}

function VerifyRow({ icon, title, sub, required, checked, onToggle }) {
  return (
    <button onClick={required ? undefined : onToggle} style={{ display: "flex", alignItems: "center", gap: 11, padding: "13px 15px", borderRadius: 13, background: checked ? "rgba(155,109,215,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${checked ? "rgba(155,109,215,0.25)" : "rgba(255,255,255,0.06)"}`, cursor: required ? "default" : "pointer", width: "100%", textAlign: "left", color: "#fff", transition: "all 0.25s ease" }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>
          {title}
          {required && <span style={{ fontSize: 10, color: PURPLE[300], marginLeft: 6, fontWeight: 500, padding: "2px 6px", background: "rgba(155,109,215,0.12)", borderRadius: 4 }}>필수</span>}
        </div>
        <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${checked ? PURPLE[500] : "rgba(255,255,255,0.18)"}`, background: checked ? PURPLE[500] : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease", flexShrink: 0 }}>
        {checked && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2.5 6l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>}
      </div>
    </button>
  );
}

/* ─── STEP 4: Photo Upload ─── */
function PhotoUploadStep({ onNext }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "16px 0" }}>
      <div>
        <SectionLabel>STEP 3 · 실물 신뢰 인증</SectionLabel>
        <Heading sub="만났을 때 괴리를 줄이기 위한 사진이에요. 과한 보정만 아니면 괜찮아요.">나를 보여주는 사진을 올려주세요</Heading>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ padding: "18px", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(155,109,215,0.25)", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(155,109,215,0.12)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z" stroke={PURPLE[300]} strokeWidth="1.5" fill="none" /></svg>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: PURPLE[100], marginBottom: 4 }}>프로필 사진</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>자연광 정면 상반신, 깔끔한 복장</div>
          <div style={{ marginTop: 12, padding: "10px 20px", borderRadius: 10, background: "rgba(155,109,215,0.12)", color: PURPLE[300], fontSize: 13, fontWeight: 600, display: "inline-block", cursor: "pointer" }}>사진 선택</div>
        </div>

        <div style={{ padding: "18px", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.1)", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.06)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" /></svg>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>실물 인증 사진 <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>선택</span></div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>보정 없는 일상 사진 · 상대방에게 더 높은 신뢰를 줘요</div>
          <div style={{ marginTop: 12, padding: "10px 20px", borderRadius: 10, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 600, display: "inline-block", cursor: "pointer" }}>사진 선택</div>
        </div>
      </div>

      <div style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>📸 사진 가이드</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {[
            { text: "셀카보다 타인이 찍어준 사진", good: true },
            { text: "자연광에서 찍은 정면 또는 반측면", good: true },
            { text: "과한 필터, 심한 보정 사진", good: false },
            { text: "선글라스, 마스크 등 얼굴을 가린 사진", good: false },
          ].map((g, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: g.good ? "rgba(155,200,130,0.8)" : "rgba(255,150,150,0.7)" }}>
              <span>{g.good ? "✓" : "✕"}</span>
              <span>{g.text}</span>
            </div>
          ))}
        </div>
      </div>

      <Btn onClick={onNext}>다음</Btn>
      <Btn variant="ghost" onClick={onNext}>나중에 올리기 →</Btn>
    </div>
  );
}

/* ─── STEP 5: Personality ─── */
function PersonalityStep({ onNext }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const questions = [
    { q: "주말에 에너지를 충전하는 방식은 어떤가요?", options: ["혼자만의 시간이 꼭 필요해요", "가까운 사람과 함께 보내요", "새로운 사람들과 어울려요", "그때그때 달라요"] },
    { q: "연인과 갈등이 생기면 어떻게 하시나요?", options: ["바로 대화로 풀어요", "시간을 두고 생각한 후 이야기해요", "상대방이 먼저 말해주길 기다려요", "글이나 메시지로 전달해요"] },
    { q: "결혼 후 가장 중요하게 생각하는 건?", options: ["서로의 시간과 공간을 존중하는 것", "매일 대화하고 함께하는 시간", "경제적 안정과 미래 설계", "서로의 가족과 잘 지내는 것"] },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "16px 0" }}>
      <div>
        <SectionLabel>STEP 4 · 내면의 결 {currentQ + 1}/{questions.length}</SectionLabel>
        <Heading sub="이 답변을 기반으로 성격 파동과 매칭 타입이 분석돼요.">나의 성향을 알려주세요</Heading>
      </div>

      <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((currentQ + (answers[currentQ] !== undefined ? 1 : 0)) / questions.length) * 100}%`, background: `linear-gradient(90deg, ${PURPLE[500]}, ${PURPLE[300]})`, borderRadius: 2, transition: "width 0.4s ease" }} />
      </div>

      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: PURPLE[100], marginBottom: 12, lineHeight: 1.5 }}>{questions[currentQ].q}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {questions[currentQ].options.map((opt, i) => (
            <button key={i} onClick={() => setAnswers((a) => ({ ...a, [currentQ]: i }))} style={{ padding: "12px 15px", borderRadius: 12, background: answers[currentQ] === i ? "linear-gradient(135deg, rgba(155,109,215,0.2), rgba(192,132,224,0.1))" : "rgba(255,255,255,0.03)", border: `1px solid ${answers[currentQ] === i ? "rgba(155,109,215,0.35)" : "rgba(255,255,255,0.06)"}`, color: answers[currentQ] === i ? PURPLE[200] : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: answers[currentQ] === i ? 600 : 400, cursor: "pointer", textAlign: "left", transition: "all 0.25s ease" }}>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {currentQ > 0 && <Btn variant="secondary" onClick={() => setCurrentQ(currentQ - 1)} style={{ flex: 1 }}>이전</Btn>}
        <Btn disabled={answers[currentQ] === undefined} onClick={() => currentQ < questions.length - 1 ? setCurrentQ(currentQ + 1) : onNext()} style={{ flex: 2 }}>
          {currentQ < questions.length - 1 ? "다음 질문" : "완료"}
        </Btn>
      </div>

      <UnlockBadge icon="🌊" title="질문 완료 시 잠금해제" desc="성격 파동 그래프 + 매칭 타입 + 결맞춤 점수" />
    </div>
  );
}

/* ─── STEP 6: Match Card (3-tier) ─── */
function MatchCardStep({ onNext, verifications }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [tier, setTier] = useState(0);
  const photoColors = ["linear-gradient(135deg, #8b6cc7, #c49dd8)", "linear-gradient(135deg, #7c5cbf, #a88fd0)", "linear-gradient(135deg, #9b7dd7, #d4b8e8)"];

  useEffect(() => {
    const t = setTimeout(() => setPhotoIdx(1), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "16px 0" }}>
      <div style={{ textAlign: "center" }}>
        <SectionLabel>매칭 카드 미리보기</SectionLabel>
        <Heading>이렇게 상대방이 보여요</Heading>
      </div>

      {/* Photo priority area */}
      <div style={{ position: "relative", borderRadius: 18, overflow: "hidden" }}>
        <div style={{ width: "100%", height: 220, background: photoColors[photoIdx], transition: "background 0.6s ease", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 48, opacity: 0.3 }}>👤</span>
        </div>
        <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
          {[0, 1, 2].map((i) => (
            <button key={i} onClick={() => setPhotoIdx(i)} style={{ width: i === photoIdx ? 18 : 6, height: 6, borderRadius: 3, background: i === photoIdx ? "#fff" : "rgba(255,255,255,0.4)", border: "none", cursor: "pointer", transition: "all 0.3s ease", padding: 0 }} />
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 10, right: 12, fontSize: 11, color: "rgba(255,255,255,0.5)" }}>← 스와이프</div>
      </div>

      {/* 결맞춤 highlight */}
      <div style={{ padding: "14px 16px", borderRadius: 14, background: "linear-gradient(135deg, rgba(155,109,215,0.15), rgba(192,132,224,0.08))", border: "1px solid rgba(155,109,215,0.25)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: PURPLE[100] }}>결맞춤 87점</span>
          <span style={{ fontSize: 12, color: PURPLE[300], fontWeight: 600 }}>높은 궁합</span>
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.5, fontWeight: 500 }}>
          두 분은 대화 속도와 관계 기대치가 비슷해요.
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          {["생활 리듬 유사", "감정 호흡 맞음", "갈등 해결 방식 호환"].map((r) => (
            <span key={r} style={{ padding: "4px 10px", borderRadius: 8, fontSize: 11, background: "rgba(155,109,215,0.12)", color: PURPLE[200], border: "1px solid rgba(155,109,215,0.18)" }}>{r}</span>
          ))}
        </div>
      </div>

      {/* 3-tier tabs */}
      <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 3 }}>
        {[{ label: "한눈에", icon: "⚡" }, { label: "관심 정보", icon: "💜" }, { label: "깊게 보기", icon: "📋" }].map((t, i) => (
          <button key={i} onClick={() => setTier(i)} style={{ flex: 1, padding: "9px 0", borderRadius: 10, background: tier === i ? "rgba(155,109,215,0.15)" : "transparent", border: tier === i ? "1px solid rgba(155,109,215,0.2)" : "1px solid transparent", color: tier === i ? PURPLE[200] : "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{ minHeight: 140 }}>
        {tier === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <InfoRow label="기본" value="32세 · 여 · 서울 강남" />
            <InfoRow label="직업" value={verifications.job ? "IT기업 · 대기업 · 마케팅" : "인증 시 공개"} locked={!verifications.job} />
            <InfoRow label="매칭" value="다이나믹 듀오 — 대화 텐션이 잘 맞는 편" />
          </div>
        )}
        {tier === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["따뜻한 유머 감각", "경청을 잘하는 편", "주말엔 카페 탐방", "깔끔한 패션 센스", "건강한 생활습관", "반려동물 좋아함"].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ color: PURPLE[300], fontSize: 14 }}>✦</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{s}</span>
              </div>
            ))}
          </div>
        )}
        {tier === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <InfoRow label="학력" value={verifications.edu ? "서울 소재 4년제 · 경영학" : "인증 시 공개"} locked={!verifications.edu} />
            <InfoRow label="소득" value={verifications.income ? "연소득 상위 20%" : "인증 시 공개"} locked={!verifications.income} />
            <InfoRow label="가치관" value="가정 중심, 맞벌이 선호" />
            <InfoRow label="결혼관" value="2~3년 내 결혼 희망" />
            <InfoRow label="라이프" value="운동 주 3회, 요리 즐김" />
            <InfoRow label="연애" value="스킨십 적극적, 연락 하루 3~5회" />
          </div>
        )}
      </div>

      <Btn onClick={onNext}>파동 상세 보기 →</Btn>
    </div>
  );
}

function InfoRow({ label, value, locked }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600, width: 36, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: locked ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)", fontStyle: locked ? "italic" : "normal" }}>{locked ? "🔒 " : ""}{value}</span>
    </div>
  );
}

/* ─── STEP 7: Wave Detail ─── */
function WaveDetailStep({ onNext }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "16px 0" }}>
      <div>
        <SectionLabel>파동 궁합 상세</SectionLabel>
        <Heading sub="브랜드 언어 아래에 쉬운 해석을 함께 보여줘요.">매칭 타입 해석 개선안</Heading>
      </div>

      <div style={{ padding: "18px", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <svg width="100%" height="80" viewBox="0 0 300 80">
          <path d="M0,40 Q30,10 60,40 T120,40 T180,40 T240,40 T300,40" stroke={PURPLE[500]} strokeWidth="2.5" fill="none" opacity="0.8" />
          <path d="M0,40 Q35,65 70,40 T140,40 T210,40 T280,40 T300,40" stroke={PURPLE[300]} strokeWidth="2" fill="none" opacity="0.5" />
        </svg>
        <div style={{ textAlign: "center", marginTop: 4, display: "flex", justifyContent: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}><span style={{ color: PURPLE[500] }}>━━</span> 나</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}><span style={{ color: PURPLE[300] }}>━━</span> 상대방</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <MatchTypeCard brand="다이나믹 듀오" plain="대화 텐션이 잘 맞는 편" desc="서로의 에너지가 상승 작용을 일으켜요. 대화가 끊기지 않고 함께 있을 때 활기를 느낍니다." score={87} active />
        <MatchTypeCard brand="견고한 성벽" plain="신뢰 · 안정형" desc="서로에게 흔들리지 않는 든든함을 줘요. 갈등 상황에서도 차분하게 해결하는 조합입니다." score={72} />
        <MatchTypeCard brand="고요한 호수" plain="감정 리듬이 비슷한 편" desc="감정의 깊이와 표현 속도가 비슷해서 자연스럽게 공감이 형성되는 조합이에요." score={65} />
      </div>

      <div style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(155,109,215,0.08)", border: "1px solid rgba(155,109,215,0.15)", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16 }}>💡</span>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
          <strong style={{ color: PURPLE[200] }}>개선 포인트:</strong> 각 매칭 타입 옆에 한 줄 해석을 기본 노출하고, 인포 버튼은 더 크고 눈에 띄게 배치
        </div>
      </div>

      <Btn onClick={onNext}>다음 →</Btn>
    </div>
  );
}

function MatchTypeCard({ brand, plain, desc, score, active }) {
  return (
    <div style={{ padding: "14px 16px", borderRadius: 14, background: active ? "rgba(155,109,215,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${active ? "rgba(155,109,215,0.25)" : "rgba(255,255,255,0.06)"}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <div>
          <span style={{ fontSize: 14, fontWeight: 700, color: active ? PURPLE[100] : "rgba(255,255,255,0.5)" }}>{brand}</span>
          <span style={{ fontSize: 12, color: active ? PURPLE[300] : "rgba(255,255,255,0.3)", marginLeft: 8 }}>| {plain}</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: active ? PURPLE[300] : "rgba(255,255,255,0.25)" }}>{score}</span>
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.55 }}>{desc}</div>
    </div>
  );
}

/* ─── STEP 8: Meeting & Policy ─── */
function MeetingPolicyStep({ onNext }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "16px 0" }}>
      <div>
        <SectionLabel>만남 프로세스</SectionLabel>
        <Heading>억지 대화 없이, 바로 만남</Heading>
      </div>

      <div style={{ padding: "18px", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: PURPLE[100], marginBottom: 12 }}>📅 내가 원하는 시간 선택</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["토 오후 2시", "토 오후 5시", "일 오전 11시", "일 오후 3시"].map((t, i) => (
            <button key={i} style={{ padding: "10px 14px", borderRadius: 10, background: i === 1 ? "rgba(155,109,215,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${i === 1 ? "rgba(155,109,215,0.3)" : "rgba(255,255,255,0.06)"}`, color: i === 1 ? PURPLE[200] : "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: i === 1 ? 600 : 400, cursor: "pointer" }}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 10 }}>선택하면 앱이 장소까지 추천해줘요</div>
      </div>

      <div style={{ padding: "14px 16px", borderRadius: 14, background: "rgba(155,109,215,0.06)", border: "1px solid rgba(155,109,215,0.12)" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: PURPLE[200], marginBottom: 8 }}>💡 만남 팁 제공 타이밍</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { time: "매칭 성사 직후", desc: "상대방 성향 기반 대화 포인트" },
            { time: "약속 확정 시", desc: "장소 추천 + 복장 가이드" },
            { time: "만남 하루 전", desc: "결맞춤 리마인드 + 준비 체크리스트" },
          ].map((tip, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: PURPLE[400], flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{tip.time}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginLeft: 6 }}>{tip.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: PURPLE[100], marginBottom: 12 }}>취소/변경 정책 (개선안)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "노쇼", policy: "환불 불가", color: "rgba(255,120,120,0.7)", bg: "rgba(255,120,120,0.08)" },
            { label: "24시간 이내 취소", policy: "50% 환불", color: "rgba(255,200,100,0.8)", bg: "rgba(255,200,100,0.08)" },
            { label: "24시간 이전 취소", policy: "전액 환불 또는 1회 무료 변경", color: "rgba(155,200,130,0.8)", bg: "rgba(155,200,130,0.08)" },
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderRadius: 10, background: p.bg, border: `1px solid ${p.color.replace(/[\d.]+\)/, "0.15)")}` }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{p.label}</span>
              <span style={{ fontSize: 13, color: p.color, fontWeight: 600 }}>{p.policy}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 10, lineHeight: 1.5 }}>
          * 단계형 정책으로 사용자 수용도를 높이면서 노쇼는 엄격하게 관리
        </div>
      </div>

      <Btn onClick={onNext}>완료 →</Btn>
    </div>
  );
}

/* ─── STEP 9: Complete ─── */
function CompleteStep({ onRestart }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, padding: "32px 0 16px", textAlign: "center" }}>
      <div style={{ width: 76, height: 76, borderRadius: "50%", background: "linear-gradient(135deg, rgba(155,109,215,0.2), rgba(192,132,224,0.1))", border: "2px solid rgba(155,109,215,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>💜</div>

      <Heading sub="외면의 결과 내면의 결이 맞는 분을 찾아드릴게요.">프로토타입 종료</Heading>

      <div style={{ width: "100%", padding: "16px", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "left" }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 12, letterSpacing: "0.05em" }}>이 프로토타입에 반영된 개선사항</div>
        {[
          "① 보상 먼저 설득 — 매칭 카드 예시 + 핵심가치 메시지",
          "② 단계형 온보딩 — 필수/선택 분리 + 나중에 가능",
          "③ 핵심가치 재정렬 — 선불X, 억지대화X, 결맞춤",
          "④ 만남 시간 셀링포인트로 활용",
          "⑤ 사진 리프레이밍 — 무보정→실물 신뢰 인증",
          "⑥ 직장명 단계 공개 — 업종/규모 먼저",
          "⑦ 카드 3층 구조 — 한눈에/관심/깊게",
          "⑧ 사진 우선순위 + 스와이프 + 자동전환",
          "⑨ 결맞춤 시각적 우선순위 강화",
          "⑩ 매칭 타입 쉬운 해석 병기",
          "⑪ 취소 정책 단계형 + 만남팁 타이밍",
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "5px 0", borderBottom: i < 10 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" style={{ marginTop: 2, flexShrink: 0 }}><circle cx="7" cy="7" r="6" fill="rgba(155,109,215,0.2)" /><path d="M4 7l2 2 4-4" stroke={PURPLE[300]} strokeWidth="1.3" fill="none" strokeLinecap="round" /></svg>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>

      <Btn onClick={onRestart}>↻ 처음부터 다시 보기</Btn>
    </div>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [step, setStep] = useState(0);
  const [verifications, setVerifications] = useState({ identity: true, phone: true, job: false, edu: false, income: false });
  const containerRef = useRef(null);

  const goTo = useCallback((s) => {
    setStep(s);
    if (containerRef.current) containerRef.current.scrollTop = 0;
  }, []);

  const next = () => goTo(step + 1);
  const prev = () => goTo(step - 1);
  const restart = () => {
    setStep(0);
    setVerifications({ identity: true, phone: true, job: false, edu: false, income: false });
  };

  const renderStep = () => {
    switch (STEPS[step]) {
      case "preview": return <PreviewStep onNext={next} onSkip={() => goTo(2)} />;
      case "value_prop": return <ValuePropStep onNext={next} />;
      case "basic_info": return <BasicInfoStep onNext={next} />;
      case "verify_select": return <VerifySelectStep onNext={next} verifications={verifications} setVerifications={setVerifications} />;
      case "photo_upload": return <PhotoUploadStep onNext={next} />;
      case "personality": return <PersonalityStep onNext={next} />;
      case "match_card": return <MatchCardStep onNext={next} verifications={verifications} />;
      case "wave_detail": return <WaveDetailStep onNext={next} />;
      case "meeting_policy": return <MeetingPolicyStep onNext={next} />;
      case "complete": return <CompleteStep verifications={verifications} onRestart={restart} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #1a0e2e 0%, #0f0a1a 100%)", display: "flex", justifyContent: "center", padding: "16px", fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      <div ref={containerRef} style={{ width: "100%", maxWidth: 400, background: "linear-gradient(180deg, rgba(30,18,50,0.95), rgba(15,10,26,0.98))", borderRadius: 28, border: "1px solid rgba(155,109,215,0.1)", boxShadow: "0 0 80px rgba(124,79,191,0.06), inset 0 1px 0 rgba(255,255,255,0.03)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "18px 22px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {step > 0 && step < STEPS.length - 1 ? (
            <button onClick={prev} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.45)", fontSize: 13, cursor: "pointer", padding: "4px 0", display: "flex", alignItems: "center", gap: 3 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              이전
            </button>
          ) : <div style={{ width: 40 }} />}
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em", background: `linear-gradient(135deg, ${PURPLE[300]}, ${PURPLE[500]})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>결하다</div>
          <div style={{ width: 40 }} />
        </div>

        {step < STEPS.length - 1 && <StepProgress current={step} total={STEPS.length - 1} />}

        <div style={{ padding: "0 22px 28px", flex: 1, overflowY: "auto" }}>{renderStep()}</div>
      </div>
    </div>
  );
}
