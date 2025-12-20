import React, { useEffect, useState } from "react";
import axios from "axios";
import '@fontsource/alkatra';
import {CalendarDays, Flame, GlassWater} from 'lucide-react';

function History() {
  const [history, setHistory] = useState([]);
  const [availableHistory, setAvailableHistory] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("fitmate_token");
        if (!token) {
          setAvailableHistory(false);
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "https://fm-new-2.onrender.com/api/history/fetch",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setHistory(res.data.data || []);
      } catch (err) {
        console.error("History fetch error:", err);
        setAvailableHistory(false);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div
      className="bg-[#FFE8D6] min-h-screen border-5 border-[#492110]"
      style={{ fontFamily: "alkatra" }}
    >
      <div className="bg-[#FFF3E9] min-h-[calc(100vh-70px)] m-5 border-5 border-[#492110] rounded-2xl" style={{color:"#492110"}}>
        <h1 className="text-3xl font-bold p-5">History Page</h1>

        {loading ? (
          <p className="p-5">Loading history...</p>
        ) : availableHistory ? (
          <div className="p-5 space-y-4">
            {history.length === 0 ? (
              <p>No history available.</p>
            ) : (
              history.map((log, index) => (
                <div style={{fontFamily:"alkatra"}}>
                  <div
                    key={index}
                    className="border-5 border-[#492110] rounded-2xl p-4 bg-[#FFE8D6]"
                  >
                    <p className="font-bold"><CalendarDays color="#492110" className="h-5 w-5 inline mr-2" /> Date: {log.date}</p>
                    <p><Flame color="#FF2B00" className="h-5 w-5 inline mr-2" /> Calories: {log.calories}</p>
                    <p><GlassWater color="#00D0FF" className="h-5 w-5 inline mr-2" /> Water: {log.water} Glasses</p>

                    <div className="mt-2 text-sm">
                      <p>Protein: {log.protein}g</p>
                      <p>Fats: {log.fats}g</p>
                      <p>Carbs: {log.carbs}g</p>
                      <p>Fibre: {log.fibre}g</p>
                    </div>

                    {log.foods.length > 0 && (
                      <div className="mt-3">
                        <p className="font-semibold">🍽 Foods:</p>
                        <ul className="list-disc list-inside text-sm">
                          {log.foods.map((food, i) => (
                            <li key={i}>
                              {food.name} — {food.calories} cal
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <p className="p-5">History is not available.</p>
        )}
      </div>
    </div>
  );
}

export default History;
