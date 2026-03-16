import { useState, useEffect, useRef } from "react";

const STEPS = [
  "preview",
  "value_prop",
  "basic_info",
  "verify_select",
  "personality",
  "complete",
];

// Blurred sample profile card
function SampleMatchCard({ blur = true, revealLevel = 0 }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(8px)",
        borderRadius: 20,
        padding: "20px 18px",
        border: "1px solid rgba(255,255,255,0.1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Photo area */}
      <div
        style={{
          width: "100%",
          height: 200,
          borderRadius: 14,
          background: blur
            ? "linear-gradient(135deg, #7c5cbf 0%, #b88fd0 50%, #d4a8e0 100%)"
            : "linear-gradient(135deg, #8b6cc7 0%, #c49dd8 50%, #e0b8ec 100%)",
          filter: blur ? "blur(12px)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
          position: "relative",
        }}
      >
        {blur && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              filter: "none",
              zIndex: 2,
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="3"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.5"
              />
              <path
                d="M7 11V7a5 5 0 0110 0v4"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Info rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 100,
              height: 18,
              borderRadius: 9,
              background: blur
                ? "rgba(255,255,255,0.12)"
                : "rgba(255,255,255,0.2)",
              filter: blur ? "blur(4px)" : "none",
            }}
          />
          <div
            style={{
              width: 50,
              height: 18,
              borderRadius: 9,
              background: "rgba(255,255,255,0.08)",
              filter: blur ? "blur(4px)" : "none",
            }}
          />
        </div>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginTop: 4,
          }}
        >
          {["외모", "직업", "성격", "가치관", "라이프", "재정"].map(
            (tag, i) => (
              <div
                key={tag}
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 500,
                  background:
                    revealLevel > i
                      ? "linear-gradient(135deg, #9b6dd7, #c084e0)"
                      : "rgba(255,255,255,0.08)",
                  color:
                    revealLevel > i
                      ? "#fff"
                      : "rgba(255,255,255,0.35)",
                  border: `1px solid ${revealLevel > i ? "transparent" : "rgba(255,255,255,0.1)"}`,
                  transition: "all 0.5s ease",
                }}
              >
                {tag}
              </div>
            )
          )}
        </div>

        {/* Wave preview */}
        <div
          style={{
            marginTop: 8,
            height: 50,
            borderRadius: 12,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            filter: blur ? "blur(3px)" : "none",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <svg width="100%" height="40" viewBox="0 0 300 40">
            <path
              d="M0,20 Q30,5 60,20 T120,20 T180,20 T240,20 T300,20"
              stroke="rgba(155,109,215,0.5)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0,20 Q30,35 60,20 T120,20 T180,20 T240,20 T300,20"
              stroke="rgba(192,132,224,0.3)"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Progress indicator
function StepProgress({ current, total }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        justifyContent: "center",
        padding: "16px 0",
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 28 : 8,
            height: 8,
            borderRadius: 4,
            background:
              i === current
                ? "linear-gradient(90deg, #9b6dd7, #c084e0)"
                : i < current
                  ? "#9b6dd7"
                  : "rgba(255,255,255,0.15)",
            transition: "all 0.4s ease",
          }}
        />
      ))}
    </div>
  );
}

// Animated reveal line
function RevealLine({ icon, label, value, delay = 0, active = false }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (active) {
      const t = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(t);
    }
  }, [active, delay]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderRadius: 14,
        background: visible
          ? "rgba(155,109,215,0.12)"
          : "rgba(255,255,255,0.04)",
        border: `1px solid ${visible ? "rgba(155,109,215,0.25)" : "rgba(255,255,255,0.06)"}`,
        opacity: visible ? 1 : 0.4,
        transform: visible ? "translateX(0)" : "translateX(-8px)",
        transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.03em",
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 14,
            color: visible ? "#e0d0f0" : "rgba(255,255,255,0.25)",
            fontWeight: 500,
          }}
        >
          {visible ? value : "● ● ● ●"}
        </div>
      </div>
      {visible && (
        <svg width="20" height="20" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="9" fill="rgba(155,109,215,0.3)" />
          <path
            d="M6 10l3 3 5-5"
            stroke="#c084e0"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

function VerifyItem({ icon, title, subtitle, required, checked, onToggle }) {
  return (
    <button
      onClick={required ? undefined : onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 16px",
        borderRadius: 14,
        background: checked
          ? "rgba(155,109,215,0.12)"
          : "rgba(255,255,255,0.04)",
        border: `1px solid ${checked ? "rgba(155,109,215,0.3)" : "rgba(255,255,255,0.08)"}`,
        cursor: required ? "default" : "pointer",
        width: "100%",
        textAlign: "left",
        color: "#fff",
        transition: "all 0.3s ease",
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>
          {title}
          {required && (
            <span
              style={{
                fontSize: 10,
                color: "#c084e0",
                marginLeft: 6,
                fontWeight: 500,
                padding: "2px 6px",
                background: "rgba(155,109,215,0.15)",
                borderRadius: 4,
              }}
            >
              필수
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            marginTop: 2,
          }}
        >
          {subtitle}
        </div>
      </div>
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 7,
          border: `2px solid ${checked ? "#9b6dd7" : "rgba(255,255,255,0.2)"}`,
          background: checked ? "#9b6dd7" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
          flexShrink: 0,
        }}
      >
        {checked && (
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path
              d="M3 7l3 3 5-5"
              stroke="#fff"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
    </button>
  );
}

function QuestionCard({ q, options, selected, onSelect }) {
  return (
    <div style={{ marginBottom: 0 }}>
      <div
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "#ede0f8",
          marginBottom: 14,
          lineHeight: 1.5,
        }}
      >
        {q}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            style={{
              padding: "13px 16px",
              borderRadius: 12,
              background:
                selected === i
                  ? "linear-gradient(135deg, rgba(155,109,215,0.25), rgba(192,132,224,0.15))"
                  : "rgba(255,255,255,0.04)",
              border: `1px solid ${selected === i ? "rgba(155,109,215,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: selected === i ? "#e0d0f0" : "rgba(255,255,255,0.6)",
              fontSize: 13.5,
              fontWeight: selected === i ? 600 : 400,
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.25s ease",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function GyeolhadaOnboarding() {
  const [step, setStep] = useState(0);
  const [revealActive, setRevealActive] = useState(false);
  const [revealLevel, setRevealLevel] = useState(0);
  const [verifications, setVerifications] = useState({
    identity: true,
    phone: true,
    job: false,
    edu: false,
    income: false,
  });
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    if (step === 1) {
      setRevealActive(true);
      const timers = [
        setTimeout(() => setRevealLevel(1), 600),
        setTimeout(() => setRevealLevel(2), 1200),
        setTimeout(() => setRevealLevel(3), 1800),
        setTimeout(() => setRevealLevel(4), 2400),
        setTimeout(() => setRevealLevel(5), 3000),
        setTimeout(() => setRevealLevel(6), 3600),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [step]);

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    if (containerRef.current) containerRef.current.scrollTop = 0;
  };
  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const questions = [
    {
      q: "주말에 에너지를 충전하는 방식은 어떤가요?",
      options: [
        "혼자만의 시간이 꼭 필요해요",
        "가까운 사람과 함께 보내요",
        "새로운 사람들과 어울려요",
        "그때그때 달라요",
      ],
    },
    {
      q: "연인과 갈등이 생기면 어떻게 하시나요?",
      options: [
        "바로 대화로 풀어요",
        "시간을 두고 생각한 후 이야기해요",
        "상대방이 먼저 말해주길 기다려요",
        "글이나 메시지로 전달해요",
      ],
    },
    {
      q: "결혼 후 가장 중요하게 생각하는 건?",
      options: [
        "서로의 시간과 공간을 존중하는 것",
        "매일 대화하고 함께하는 시간",
        "경제적 안정과 미래 설계",
        "서로의 가족과 잘 지내는 것",
      ],
    },
  ];

  const renderStep = () => {
    switch (STEPS[step]) {
      case "preview":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              padding: "20px 0",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 4 }}>
              <div
                style={{
                  fontSize: 13,
                  color: "#c084e0",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  marginBottom: 10,
                }}
              >
                이런 분을 만나실 수 있어요
              </div>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#f0e6fa",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                외면의 결과 내면의 결이
                <br />
                맞는 사람을 찾아드릴게요
              </h2>
            </div>

            <SampleMatchCard blur={true} revealLevel={0} />

            <div
              style={{
                textAlign: "center",
                padding: "0 8px",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.7,
                }}
              >
                프로필을 완성하면 이 카드의 모든 정보가
                <br />
                공개됩니다. 상대방도 같은 수준의 정보를 제공해요.
              </div>
            </div>

            <button
              onClick={next}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 14,
                background: "linear-gradient(135deg, #9b6dd7, #7c4fbf)",
                border: "none",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 24px rgba(124,79,191,0.35)",
                letterSpacing: "0.02em",
              }}
            >
              어떤 정보를 받을 수 있는지 보기
            </button>
            <button
              onClick={() => setStep(2)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.35)",
                fontSize: 13,
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              건너뛰고 바로 시작하기
            </button>
          </div>
        );

      case "value_prop":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              padding: "20px 0",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 4 }}>
              <div
                style={{
                  fontSize: 13,
                  color: "#c084e0",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  marginBottom: 10,
                }}
              >
                당신이 제공하면, 상대방도 제공해요
              </div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#f0e6fa",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                정보를 입력할수록
                <br />
                상대방 카드가 열려요
              </h2>
            </div>

            <SampleMatchCard blur={false} revealLevel={revealLevel} />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: 4,
              }}
            >
              <RevealLine
                icon="👤"
                label="기본 정보"
                value="32세 · 서울 강남구"
                delay={200}
                active={revealActive}
              />
              <RevealLine
                icon="💼"
                label="직업 정보"
                value="IT기업 · 대기업"
                delay={800}
                active={revealActive}
              />
              <RevealLine
                icon="🎓"
                label="학력"
                value="서울 소재 4년제 · 경영학"
                delay={1400}
                active={revealActive}
              />
              <RevealLine
                icon="💰"
                label="재정 수준"
                value="연소득 상위 20%"
                delay={2000}
                active={revealActive}
              />
              <RevealLine
                icon="💜"
                label="성격 파동"
                value="다이나믹 듀오 — 활발한 에너지 조합"
                delay={2600}
                active={revealActive}
              />
              <RevealLine
                icon="✨"
                label="결맞춤 점수"
                value="87점 — 높은 궁합이에요"
                delay={3200}
                active={revealActive}
              />
            </div>

            <button
              onClick={next}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 14,
                background: "linear-gradient(135deg, #9b6dd7, #7c4fbf)",
                border: "none",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 24px rgba(124,79,191,0.35)",
                marginTop: 8,
              }}
            >
              프로필 만들기 시작
            </button>
          </div>
        );

      case "basic_info":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              padding: "20px 0",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  color: "#c084e0",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                }}
              >
                STEP 1 · 기본 정보
              </div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#f0e6fa",
                  margin: 0,
                }}
              >
                1분이면 충분해요
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.45)",
                  margin: "8px 0 0",
                  lineHeight: 1.5,
                }}
              >
                기본 정보만으로도 매칭을 시작할 수 있어요.
                <br />
                추가 인증은 나중에 해도 돼요.
              </p>
            </div>

            {[
              { label: "이름", placeholder: "실명을 입력해주세요" },
              { label: "생년월일", placeholder: "YYYY-MM-DD" },
              { label: "성별", placeholder: "선택해주세요" },
              { label: "거주 지역", placeholder: "시/구 선택" },
            ].map((field, i) => (
              <div key={i}>
                <label
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 6,
                    letterSpacing: "0.03em",
                  }}
                >
                  {field.label}
                </label>
                <div
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.3)",
                    fontSize: 14,
                  }}
                >
                  {field.placeholder}
                </div>
              </div>
            ))}

            {/* Unlock indicator */}
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 14,
                background:
                  "linear-gradient(135deg, rgba(155,109,215,0.1), rgba(192,132,224,0.05))",
                border: "1px solid rgba(155,109,215,0.2)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 22 }}>🔓</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#d8c4f0" }}>
                  이 단계 완료 시 잠금해제
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.4)",
                    marginTop: 2,
                  }}
                >
                  상대방의 기본 프로필 + 대표 사진 1장
                </div>
              </div>
            </div>

            <button
              onClick={next}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 14,
                background: "linear-gradient(135deg, #9b6dd7, #7c4fbf)",
                border: "none",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 24px rgba(124,79,191,0.35)",
              }}
            >
              다음
            </button>
          </div>
        );

      case "verify_select":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              padding: "20px 0",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  color: "#c084e0",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                }}
              >
                STEP 2 · 인증 선택
              </div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#f0e6fa",
                  margin: 0,
                }}
              >
                필수 인증 2개면 시작 가능
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.45)",
                  margin: "8px 0 0",
                  lineHeight: 1.5,
                }}
              >
                추가 인증을 할수록 상대방의 더 자세한 정보를 볼 수 있어요.
                <br />
                나중에 언제든 추가할 수 있어요.
              </p>
            </div>

            {/* Required section */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.35)",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  marginBottom: 10,
                  textTransform: "uppercase",
                }}
              >
                필수 인증
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <VerifyItem
                  icon="🪪"
                  title="본인 인증"
                  subtitle="실명 및 나이 확인"
                  required={true}
                  checked={true}
                />
                <VerifyItem
                  icon="📱"
                  title="휴대폰 인증"
                  subtitle="본인 명의 번호 확인"
                  required={true}
                  checked={true}
                />
              </div>
            </div>

            {/* Optional section */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.35)",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  marginBottom: 10,
                }}
              >
                선택 인증 — 할수록 더 많은 정보가 열려요
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <VerifyItem
                  icon="💼"
                  title="직장 인증"
                  subtitle="재직증명서 또는 건강보험자격득실"
                  required={false}
                  checked={verifications.job}
                  onToggle={() =>
                    setVerifications((v) => ({ ...v, job: !v.job }))
                  }
                />
                <VerifyItem
                  icon="🎓"
                  title="학력 인증"
                  subtitle="졸업증명서 또는 학위증"
                  required={false}
                  checked={verifications.edu}
                  onToggle={() =>
                    setVerifications((v) => ({ ...v, edu: !v.edu }))
                  }
                />
                <VerifyItem
                  icon="💰"
                  title="소득 인증"
                  subtitle="소득금액증명 또는 원천징수영수증"
                  required={false}
                  checked={verifications.income}
                  onToggle={() =>
                    setVerifications((v) => ({ ...v, income: !v.income }))
                  }
                />
              </div>
            </div>

            {/* Unlock indicator */}
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 14,
                background:
                  "linear-gradient(135deg, rgba(155,109,215,0.1), rgba(192,132,224,0.05))",
                border: "1px solid rgba(155,109,215,0.2)",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#d8c4f0",
                  marginBottom: 8,
                }}
              >
                🔓 현재 선택으로 열리는 정보
              </div>
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
              >
                {[
                  { label: "기본 프로필", always: true },
                  { label: "대표 사진", always: true },
                  {
                    label: "직업 상세",
                    active: verifications.job,
                  },
                  {
                    label: "학력 상세",
                    active: verifications.edu,
                  },
                  {
                    label: "소득 수준",
                    active: verifications.income,
                  },
                ].map((item, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 500,
                      background:
                        item.always || item.active
                          ? "rgba(155,109,215,0.2)"
                          : "rgba(255,255,255,0.05)",
                      color:
                        item.always || item.active
                          ? "#d8c4f0"
                          : "rgba(255,255,255,0.25)",
                      border: `1px solid ${item.always || item.active ? "rgba(155,109,215,0.3)" : "rgba(255,255,255,0.06)"}`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {item.always || item.active ? "✓ " : ""}
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={next}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 14,
                background: "linear-gradient(135deg, #9b6dd7, #7c4fbf)",
                border: "none",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 24px rgba(124,79,191,0.35)",
              }}
            >
              인증하고 다음으로
            </button>
            <button
              onClick={next}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.35)",
                fontSize: 13,
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              나중에 인증하기 →
            </button>
          </div>
        );

      case "personality":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              padding: "20px 0",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  color: "#c084e0",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                }}
              >
                STEP 3 · 내면의 결 {currentQ + 1}/{questions.length}
              </div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#f0e6fa",
                  margin: 0,
                }}
              >
                나의 성향을 알려주세요
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.45)",
                  margin: "8px 0 0",
                  lineHeight: 1.5,
                }}
              >
                이 답변을 기반으로 성격 파동과 매칭 타입이 분석돼요.
              </p>
            </div>

            {/* Progress bar */}
            <div
              style={{
                height: 4,
                borderRadius: 2,
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${((currentQ + (answers[currentQ] !== undefined ? 1 : 0)) / questions.length) * 100}%`,
                  background: "linear-gradient(90deg, #9b6dd7, #c084e0)",
                  borderRadius: 2,
                  transition: "width 0.4s ease",
                }}
              />
            </div>

            <QuestionCard
              q={questions[currentQ].q}
              options={questions[currentQ].options}
              selected={answers[currentQ]}
              onSelect={(i) => {
                setAnswers((a) => ({ ...a, [currentQ]: i }));
              }}
            />

            <div style={{ display: "flex", gap: 10 }}>
              {currentQ > 0 && (
                <button
                  onClick={() => setCurrentQ(currentQ - 1)}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  이전
                </button>
              )}
              <button
                onClick={() => {
                  if (currentQ < questions.length - 1)
                    setCurrentQ(currentQ + 1);
                  else next();
                }}
                disabled={answers[currentQ] === undefined}
                style={{
                  flex: 2,
                  padding: "14px",
                  borderRadius: 14,
                  background:
                    answers[currentQ] !== undefined
                      ? "linear-gradient(135deg, #9b6dd7, #7c4fbf)"
                      : "rgba(255,255,255,0.06)",
                  border: "none",
                  color:
                    answers[currentQ] !== undefined
                      ? "#fff"
                      : "rgba(255,255,255,0.25)",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor:
                    answers[currentQ] !== undefined
                      ? "pointer"
                      : "default",
                  transition: "all 0.3s ease",
                }}
              >
                {currentQ < questions.length - 1 ? "다음 질문" : "완료"}
              </button>
            </div>

            {/* Unlock indicator */}
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 14,
                background:
                  "linear-gradient(135deg, rgba(155,109,215,0.1), rgba(192,132,224,0.05))",
                border: "1px solid rgba(155,109,215,0.2)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 22 }}>🌊</div>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#d8c4f0",
                  }}
                >
                  질문 완료 시 잠금해제
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.4)",
                    marginTop: 2,
                  }}
                >
                  성격 파동 그래프 + 매칭 타입 + 결맞춤 점수
                </div>
              </div>
            </div>
          </div>
        );

      case "complete":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              padding: "40px 0 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(155,109,215,0.2), rgba(192,132,224,0.1))",
                border: "2px solid rgba(155,109,215,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
              }}
            >
              💜
            </div>

            <div>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#f0e6fa",
                  margin: "0 0 8px",
                }}
              >
                프로필이 완성됐어요!
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.5)",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                이제 외면의 결과 내면의 결이
                <br />
                맞는 분을 찾아드릴게요.
              </p>
            </div>

            {/* Unlocked items */}
            <div
              style={{
                width: "100%",
                padding: "18px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.4)",
                  fontWeight: 600,
                  marginBottom: 14,
                  letterSpacing: "0.06em",
                }}
              >
                열린 상대방 정보
              </div>
              {[
                "기본 프로필 · 나이 · 지역",
                "대표 사진 1장",
                "성격 파동 그래프",
                "매칭 타입",
                "결맞춤 점수",
                ...(verifications.job ? ["직업 상세 정보"] : []),
                ...(verifications.edu ? ["학력 상세 정보"] : []),
                ...(verifications.income ? ["소득 수준"] : []),
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 0",
                    borderBottom:
                      i < 7
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      fill="rgba(155,109,215,0.25)"
                    />
                    <path
                      d="M5 8l2 2 4-4"
                      stroke="#c084e0"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {!verifications.job &&
              !verifications.edu &&
              !verifications.income && (
                <div
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px dashed rgba(155,109,215,0.25)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 18 }}>💡</span>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.45)",
                      lineHeight: 1.5,
                    }}
                  >
                    추가 인증을 하면 직업·학력·소득 정보도 열려요.
                    <br />
                    <span style={{ color: "#c084e0", fontWeight: 600 }}>
                      설정 {">"} 인증관리
                    </span>
                    에서 언제든 추가 가능
                  </div>
                </div>
              )}

            <button
              onClick={() => {
                setStep(0);
                setCurrentQ(0);
                setAnswers({});
                setRevealActive(false);
                setRevealLevel(0);
              }}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 14,
                background: "linear-gradient(135deg, #9b6dd7, #7c4fbf)",
                border: "none",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 24px rgba(124,79,191,0.35)",
              }}
            >
              매칭 시작하기
            </button>
            <button
              onClick={() => {
                setStep(0);
                setCurrentQ(0);
                setAnswers({});
                setRevealActive(false);
                setRevealLevel(0);
              }}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.3)",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              ↻ 프로토타입 처음부터 다시 보기
            </button>
          </div>
        );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #1a0e2e 0%, #0f0a1a 100%)",
        display: "flex",
        justifyContent: "center",
        padding: "16px",
        fontFamily:
          "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
      />
      <div
        ref={containerRef}
        style={{
          width: "100%",
          maxWidth: 400,
          background:
            "linear-gradient(180deg, rgba(30,18,50,0.95), rgba(15,10,26,0.98))",
          borderRadius: 28,
          border: "1px solid rgba(155,109,215,0.12)",
          boxShadow:
            "0 0 80px rgba(124,79,191,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {step > 0 && step < 5 ? (
            <button
              onClick={prev}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.5)",
                fontSize: 14,
                cursor: "pointer",
                padding: "4px 0",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M10 4L6 8l4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              이전
            </button>
          ) : (
            <div />
          )}
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              background:
                "linear-gradient(135deg, #c084e0, #9b6dd7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            결하다
          </div>
          <div style={{ width: 40 }} />
        </div>

        {step < 5 && (
          <StepProgress
            current={step}
            total={5}
          />
        )}

        {/* Content */}
        <div
          style={{
            padding: "0 24px 32px",
            flex: 1,
            overflowY: "auto",
          }}
        >
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
