import React, { useState, useEffect } from "react";

export default function SurgeryDashboardFullView() {
  const [activePanel, setActivePanel] = useState(null);
  const [spareLenses, setSpareLenses] = useState([{ id: 1 }]);
  const [popupVisible, setPopupVisible] = useState(false); // 옵션 설정
  const [examPopupVisible, setExamPopupVisible] = useState(false); // 검사매칭
  const [viewPopupVisible, setViewPopupVisible] = useState(false); // 뷰항목 설정
  const [dropdownStates, setDropdownStates] = useState({}); // 각 드롭다운 열림 상태

  const [filterKeyword, setFilterKeyword] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filteredData, setFilteredData] = useState([]);

  const colors = ["#FF867F", "#FFAF60", "#FFE25A", "#ACED73", "#78C5F5"];

  const originalData = Array.from({ length: 33 }, (_, i) => {
    const base = {
      name: `홍길동${i + 1}`,
      info: i % 2 === 0 ? "남/60" : "여/65",
      doctor: ["김지윤", "서정석", "최은정"][i % 3],
      order: `${i + 1}순위`,
      lensMain: `백내장렌즈 +${21 + (i % 5)}.${i % 10} / ${1.0 + (i % 3)} / ${30 + i % 10}도`,
      lensSub: i % 4 === 0 ? `OS: +${22 + (i % 3)}.0 / ${2.0 + (i % 2)} / ${40 + i % 5}도` : null,
      chart: `2025000${i}`,
      memo: "고혈압 있음",
      contact: "010-1234-5678",
      exam: "우안 0.5, 좌안 0.7",
      type: `${(i % 4) + 1}실 / ${i % 2 === 0 ? "입원" : "외래"}`,
      date: `03.${25 + (i % 3)}(${["월", "화", "수"][i % 3]}) ${8 + (i % 6) * 0.5}:00`,
      diagnosis: "AMD / OD",
      orderState: ["재고범위", "주문요망", "주문완료", "렌즈도착"][i % 4],
      spareLens: `예비${i % 2 + 1}: EHT +${20 + (i % 4)}.0 / 2.25 / 30도`,
    };
    return base;
  });

  useEffect(() => {
    setFilteredData(originalData);
  }, []);

  const togglePanel = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const handleModify = () => {
    if (window.confirm("변경사항을 저장하시겠습니까?")) {
      alert("저장되었습니다.");
    }
  };

  const toggleDropdown = (key) => {
    setDropdownStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[key]?.toString() || "";
      const bVal = b[key]?.toString() || "";
      return direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
    setSortConfig({ key, direction });
    setFilteredData(sorted);
  };

  const handleFilter = (key, keyword) => {
    const filtered = originalData.filter((item) =>
      (item[key] || "").toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredData(filtered);
  };
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* 상단 제목 및 버튼 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>🩺 수술 대시보드</h1>
        <div style={{ display: "flex", gap: "6px" }}>
          <button style={{ background: "#d3f8e2" }}>예약등록</button>
          <button style={{ background: "#fef9b8" }}>예약수정</button>
          <button style={{ background: "#fbd4d4" }}>예약삭제</button>
          <button style={{ background: "#d0e2ff" }}>고객이동</button>
        </div>
      </div>

      {/* 상단 입력 버튼 */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <select>
            <option>수술일 선택</option>
            <option>2025-03-25</option>
            <option>2025-03-26</option>
          </select>
          <button onClick={() => togglePanel("기본정보")}>수술 기본정보</button>
          <button onClick={() => togglePanel("진단 및 수술계획")}>진단 및 수술계획</button>
          <button onClick={() => togglePanel("기본렌즈")}>기본 렌즈</button>
          <button onClick={() => togglePanel("예비렌즈")}>예비 렌즈</button>
          <button onClick={() => togglePanel("기타")}>기타 입력</button>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={handleModify}>수정</button>
          <button onClick={() => setExamPopupVisible(true)}>검사매칭</button>
          <button onClick={() => setViewPopupVisible(true)}>🛠️</button>
          <button onClick={() => setPopupVisible(true)}>⚙️</button>
        </div>
      </div>

      {/* 기본정보 입력 */}
      {activePanel === "기본정보" && (
        <div style={{ padding: "10px", border: "1px solid #ddd", marginBottom: "10px" }}>
          {"수술일, 수술시간, 수술구분, 수술실, 지정의".split(", ").map(label => (
            <select key={label} style={{ marginRight: "10px" }}>
              <option>{label} 선택</option>
            </select>
          ))}
          <input type="text" placeholder="순서 입력" />
        </div>
      )}

      {/* 진단 및 수술계획 */}
      {activePanel === "진단 및 수술계획" && (
        <div style={{ padding: "10px", border: "1px solid #ddd", marginBottom: "10px" }}>
          <input type="text" placeholder="진단명 입력" style={{ marginRight: "10px" }} />
          {["방향", "수술방법", "재료명"].map(label => (
            <select key={label} style={{ marginRight: "10px" }}>
              <option>{label} 선택</option>
            </select>
          ))}
        </div>
      )}

      {/* 기본 렌즈 */}
      {activePanel === "기본렌즈" && (
        <div style={{ padding: "10px", border: "1px solid #ddd", marginBottom: "10px" }}>
          {["EHT", "IOL Power", "Cylinder Power"].map(label => (
            <select key={label} style={{ marginRight: "10px" }}>
              <option>{label} 선택</option>
            </select>
          ))}
          <input type="text" placeholder="Axis 입력" style={{ marginRight: "10px" }} />
          <select>
            <option>IOL주문상태 선택</option>
            <option>재고범위</option>
            <option>주문요망</option>
            <option>주문완료</option>
            <option>렌즈도착</option>
          </select>
        </div>
      )}
      {/* 예비 렌즈 */}
      {activePanel === "예비렌즈" && (
        <div style={{ padding: "10px", border: "1px solid #ddd", marginBottom: "10px" }}>
          {spareLenses.map(({ id }) => (
            <div key={id} style={{ marginBottom: "6px" }}>
              {["EHT", "IOL Power", "Cylinder Power"].map(label => (
                <select key={label} style={{ marginRight: "10px" }}>
                  <option>{label} 선택</option>
                </select>
              ))}
              <input type="text" placeholder="Axis 입력" />
            </div>
          ))}
          {spareLenses.length < 4 && (
            <button onClick={() => setSpareLenses([...spareLenses, { id: spareLenses.length + 1 }])}>+ 렌즈 추가</button>
          )}
        </div>
      )}

      {/* 기타 입력 */}
      {activePanel === "기타" && (
        <div style={{ padding: "10px", border: "1px solid #ddd", marginBottom: "10px" }}>
          <textarea placeholder="특이사항" style={{ marginRight: "10px", width: "40%" }} />
          <textarea placeholder="연락처 및 메모" style={{ width: "40%" }} />
        </div>
      )}

      {/* 뷰 테이블 */}
      <div style={{ maxHeight: "400px", overflowY: "scroll", border: "1px solid #ccc" }}>
        <table border="1" cellPadding="8" style={{ width: "100%", fontSize: "14px" }}>
          <thead style={{ background: "#eee", position: "sticky", top: 0 }}>
            <tr>
              {[
                ["date", "수술일/시간"],
                ["type", "수술실/구분"],
                ["order", "순서"],
                ["name", "이름/성별/나이"],
                ["chart", "차트번호"],
                ["doctor", "지정의"],
                ["diagnosis", "진단 및 수술계획"],
                ["lensMain", "기본렌즈"],
                ["orderState", "IOL주문상태"],
                ["spareLens", "예비렌즈"],
                ["memo", "특이사항"],
                ["contact", "연락처 및 메모"],
                ["exam", "검사정보"],
                ["check", "체크"],
              ].map(([key, label]) => (
                <th key={key} style={{ position: "relative" }}>
                  <span onClick={() => toggleDropdown(key)} style={{ cursor: "pointer" }}>
                    {label} ▼
                  </span>
                  {dropdownStates[key] && (
                    <div style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      background: "#fff",
                      border: "1px solid #ccc",
                      padding: "10px",
                      zIndex: 10,
                      width: "200px"
                    }}>
                      <input
                        type="text"
                        placeholder="검색"
                        onChange={(e) => handleFilter(key, e.target.value)}
                        style={{ marginBottom: "8px", width: "100%" }}
                      />
                      <button onClick={() => handleSort(key)} style={{ width: "100%" }}>
                        {sortConfig.key === key && sortConfig.direction === "asc"
                          ? "🔼 오름차순"
                          : sortConfig.key === key && sortConfig.direction === "desc"
                          ? "🔽 내림차순"
                          : "정렬"}
                      </button>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, i) => (
              <tr key={i}>
                <td>{row.date}</td>
                <td>{row.type}</td>
                <td>{row.order}</td>
                <td style={{ backgroundColor: colors[i % 5] }}>
                  {row.name}<br />({row.info})
                </td>
                <td>{row.chart}</td>
                <td>{row.doctor}</td>
                <td>{row.diagnosis}</td>
                <td>
                  {row.lensMain}
                  {row.lensSub && (
                    <div style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>
                      {row.lensSub}
                    </div>
                  )}
                </td>
                <td>{row.orderState}</td>
                <td>{row.spareLens}</td>
                <td>{row.memo}</td>
                <td>{row.contact}</td>
                <td>{row.exam}</td>
                <td>
                  <input type="checkbox" onClick={() => window.confirm("체크 처리하시겠습니까?")} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 검사정보 매칭 팝업 */}
      {examPopupVisible && (
        <div style={{
          position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
          background: "white", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", zIndex: 1000
        }}>
          <h3 style={{ fontWeight: "bold" }}>검사정보 매칭</h3>
          <p>검사 항목 중 하나를 선택하세요:</p>
          {["3/15 백내장 검사", "3/25 녹내장 검사", "3/30 안과총검사"].map((exam, idx) => (
            <div key={idx}>
              <input type="radio" name="exam" id={`exam${idx}`} value={exam} />
              <label htmlFor={`exam${idx}`} style={{ marginLeft: "8px" }}>{exam}</label>
            </div>
          ))}
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => {
                const selected = document.querySelector("input[name=exam]:checked");
                if (selected) alert(`선택된 검사: ${selected.value}`);
                setExamPopupVisible(false);
              }}
              style={{ marginRight: "10px" }}
            >
              매칭
            </button>
            <button onClick={() => setExamPopupVisible(false)}>닫기</button>
          </div>
        </div>
      )}

      {/* 수술대시보드 옵션 설정 팝업 */}
      {popupVisible && (
        <div style={{
          position: "fixed", top: "10%", left: "50%", transform: "translateX(-50%)",
          background: "white", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", zIndex: 1000, width: "600px"
        }}>
          <h3 style={{ fontWeight: "bold" }}>수술대시보드 옵션 설정</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {["수술실", "재료명", "EHT", "IOL Power", "Cylinder Power"].map((group, idx) => (
              <div key={idx} style={{ flex: "1 1 45%" }}>
                <h4>{group}</h4>
                <ul>
                  <li>옵션 A <button>사용안함</button> <button>삭제</button></li>
                  <li>옵션 B <button>사용안함</button> <button>삭제</button></li>
                  <li><button>+ 추가</button></li>
                </ul>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <button onClick={() => setPopupVisible(false)}>저장</button>
          </div>
        </div>
      )}

      {/* 뷰 항목 설정 팝업 */}
      {viewPopupVisible && (
        <div style={{
          position: "fixed", top: "15%", left: "50%", transform: "translateX(-50%)",
          background: "white", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", zIndex: 1000, width: "500px"
        }}>
          <h3 style={{ fontWeight: "bold" }}>자리 별 뷰 항목 설정</h3>
          <table border="1" cellPadding="6" style={{ width: "100%", marginTop: "10px" }}>
            <thead>
              <tr>
                <th>항목</th>
                <th>표시</th>
              </tr>
            </thead>
            <tbody>
              {[
                "차트번호", "지정의", "진단 및 수술계획", "기본렌즈",
                "IOL주문상태", "예비렌즈", "특이사항", "연락처 및 메모", "검사정보", "체크"
              ].map((item, i) => (
                <tr key={i}>
                  <td>{item}</td>
                  <td><input type="checkbox" defaultChecked /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "10px", textAlign: "right" }}>
            <button onClick={() => setViewPopupVisible(false)}>저장</button>
          </div>
        </div>
      )}
    </div>
  );
}
