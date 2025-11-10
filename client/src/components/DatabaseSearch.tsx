import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Search, Database } from "lucide-react";
import { Input } from "./ui/input";
import { useDetectiveGame } from "@/lib/stores/useDetectiveGame";

interface DatabaseResult {
  ign: string;
  ip: string;
  mainCharacter: string;
  session: string;
  winRate: string;
}

interface DatabaseSearchProps {
  searchType: string;
  searchValue: string;
  results: DatabaseResult[];
  onComplete: () => void;
}

export function DatabaseSearch({
  searchType,
  searchValue,
  results,
  onComplete,
}: DatabaseSearchProps) {
  const recordInteractiveSequence = useDetectiveGame(
    (state) => state.recordInteractiveSequence
  );
  const [inputValue, setInputValue] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (inputValue.trim().toLowerCase() === searchValue.toLowerCase()) {
      setShowResults(true);
      setSearched(true);
      recordInteractiveSequence();

      setTimeout(() => {
        onComplete();
      }, 3000);
    } else {
      setSearched(true);
      setShowResults(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto max-h-[90vh] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2 justify-center text-lg sm:text-xl">
          <Database className="w-5 h-5 sm:w-6 sm:h-6" />
          Database Search
        </CardTitle>
        <p className="text-center text-sm sm:text-base text-muted-foreground">
          Search player database by IP address
        </p>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 overflow-y-auto flex-1">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder={`Enter ${searchType.toUpperCase()} address...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="flex-1 text-sm sm:text-base"
            />
            <Button onClick={handleSearch} size="lg">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="ml-2 hidden sm:inline">Search</span>
            </Button>
          </div>

          {searched && !showResults && (
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
              <p className="text-slate-600 dark:text-slate-400">
                No results found. Try: {searchValue}
              </p>
            </div>
          )}

          {showResults && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 border border-green-500 rounded-lg">
                <p className="text-center text-green-700 dark:text-green-400 font-semibold">
                  🔍 SEARCH RESULTS
                </p>
              </div>

              {results.map((result, index) => (
                <div
                  key={index}
                  className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">IGN: {result.ign}</span>
                    {result.winRate.includes("🚨") && (
                      <span className="text-xs px-2 py-1 bg-red-500 text-white rounded-full">
                        SUSPICIOUS
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">
                        IP:
                      </span>{" "}
                      <span className="font-mono font-semibold">
                        {result.ip}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">
                        Main Character:
                      </span>{" "}
                      <span className="font-semibold">{result.mainCharacter}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">
                        Session:
                      </span>{" "}
                      <span>{result.session}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">
                        Win Rate:
                      </span>{" "}
                      <span
                        className={
                          result.winRate.includes("🚨")
                            ? "font-bold text-red-500"
                            : ""
                        }
                      >
                        {result.winRate}
                      </span>
                    </div>
                  </div>

                  {result.session.includes("23:50") && (
                    <div className="mt-3 p-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-500 rounded">
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        ⚠️ Started playing 3 minutes after Shadow modification!
                      </p>
                    </div>
                  )}
                </div>
              ))}

              <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                Press Continue when you're ready
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
