import { useState, useEffect } from "react";

function App() {
  const [status, setStatus] = useState("upload");
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const [activeAgent, setActiveAgent] = useState(0);
  const [expanded, setExpanded] = useState({
    summary: false,
    risks: false,
    questions: false,
    parsed: false,
    explained: false,
  });

  const agents = [
    "Parsing PDF",
    "Understanding medical terms",
    "Assessing risks",
    "Generating questions",
    "Writing summary"
  ];

  useEffect(() => {
    if (status === "loading") {
      setActiveAgent(0);
      const interval = setInterval(() => {
        setActiveAgent(prev => {
          if (prev < agents.length - 1) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const toggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const formatText = (text) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p style="margin-bottom:8px">')
      .replace(/\n/g, '<br/>')
      .replace(/(\d+)\.\s/g, '<br/><strong>$1.</strong> ');
  };

const handleUpload = async () => {
  if (!file) return;
  setStatus("loading");
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("https://mediagent-ai-1.onrender.com/analyze", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setResult(data);
    setStatus("result");  // ← ADD THIS LINE
  } catch (error) {
    setResult({ summary: "Error occurred. Please try again." });
    setStatus("result");
  }
};

  const Card = ({ title, content, colorKey, expandKey }) => {
    const colors = {
      green: { bg: "bg-green-50", border: "border-green-200", title: "text-green-700", btn: "text-green-500 hover:text-green-700" },
      red: { bg: "bg-red-50", border: "border-red-100", title: "text-red-600", btn: "text-red-400 hover:text-red-600" },
      blue: { bg: "bg-blue-50", border: "border-blue-100", title: "text-blue-600", btn: "text-blue-400 hover:text-blue-600" },
      gray: { bg: "bg-white", border: "border-gray-100", title: "text-gray-500", btn: "text-gray-400 hover:text-gray-600" },
    };
    const c = colors[colorKey];
    const isExpanded = expanded[expandKey];

    return (
      <div className={`${c.bg} border ${c.border} rounded-2xl p-5 flex flex-col`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-xs font-semibold ${c.title} uppercase tracking-wider`}>{title}</h2>
          <button onClick={() => toggle(expandKey)} className={`text-xs ${c.btn} transition-all`}>
            {isExpanded ? "Collapse ▲" : "Expand ▼"}
          </button>
        </div>
        <div
          className={`text-gray-700 text-sm leading-relaxed overflow-hidden transition-all duration-300 ${isExpanded ? "" : "max-h-32"}`}
          dangerouslySetInnerHTML={{
            __html: '<p style="margin-bottom:8px">' + formatText(content) + '</p>'
          }}
        />
        {!isExpanded && (
          <button onClick={() => toggle(expandKey)} className={`text-xs ${c.btn} mt-2 text-left`}>
            Read more...
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="font-semibold text-gray-800 text-lg">MediScan AI</span>
        </div>
        <span className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full">
          5 agents active
        </span>
      </nav>

      {/* Upload Screen */}
      {status === "upload" && (
        <div className="flex flex-col items-center justify-center min-h-[85vh] px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-lg text-center">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Upload Medical Report</h1>
            <p className="text-gray-500 mb-8">Upload your blood test or lab report PDF and get a plain English analysis instantly</p>
            <label className="border-2 border-dashed border-gray-200 rounded-xl p-8 block cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all mb-6">
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              {file ? (
                <div className="text-green-600 font-medium">{file.name}</div>
              ) : (
                <div className="text-gray-400">Click to choose PDF file</div>
              )}
            </label>
            <button
              onClick={handleUpload}
              disabled={!file}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Analyze Report
            </button>
          </div>
        </div>
      )}

      {/* Loading Screen */}
      {status === "loading" && (
        <div className="flex flex-col items-center justify-center min-h-[85vh]">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-md text-center">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Analyzing your report</h2>
            <p className="text-gray-500 mb-8">5 AI agents are working together...</p>
            <div className="flex flex-col gap-3">
              {agents.map((agent, i) => (
                <div key={i} className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl transition-all duration-700 ${
                  i === activeAgent ? "bg-green-50 border border-green-200" :
                  i < activeAgent ? "opacity-50" : "opacity-20"
                }`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-500 ${
                    i === activeAgent ? "bg-green-500 animate-pulse" :
                    i < activeAgent ? "bg-green-300" : "bg-gray-300"
                  }`}></div>
                  <span className={`text-sm font-medium ${
                    i === activeAgent ? "text-green-700" :
                    i < activeAgent ? "text-gray-400" : "text-gray-300"
                  }`}>{agent}</span>
                  {i < activeAgent && <span className="ml-auto text-green-500 text-xs">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Result Screen */}
      {status === "result" && result && (
        <div className="max-w-6xl mx-auto px-6 py-10">

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Analysis Complete</h1>
              <p className="text-sm text-gray-500 mt-1">Your medical report has been analyzed by 5 AI agents</p>
            </div>
            <button
              onClick={() => { setStatus("upload"); setFile(null); setResult(null); setActiveAgent(0); }}
              className="text-sm text-green-600 border border-green-200 px-4 py-2 rounded-lg hover:bg-green-50"
            >
              Analyze another
            </button>
          </div>

          {/* Section 1 */}
          <div className="grid grid-cols-2 gap-6 mb-6 items-start">
            <Card title="Summary" content={result.summary} colorKey="green" expandKey="summary" />
            <div className="flex flex-col gap-4">
              <Card title="Risk Flags — Things to take care of" content={result.risks} colorKey="red" expandKey="risks" />
              <Card title="Questions for Your Doctor" content={result.questions} colorKey="blue" expandKey="questions" />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Detailed breakdown</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Section 2 */}
          <div className="grid grid-cols-2 gap-6 items-start">
            <Card title="Extracted Values" content={result.parsed} colorKey="gray" expandKey="parsed" />
            <Card title="Medical Explanation in Simple Terms" content={result.explained} colorKey="gray" expandKey="explained" />
          </div>

        </div>
      )}
    </div>
  );
}

export default App;