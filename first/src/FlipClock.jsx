import React, { useState, useEffect } from "react";
import "./FlipClock.css";

const FlipUnit = ({ unit, value }) => {
  const [prevValue, setPrevValue] = useState(value);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setFlip(true);
      const timer = setTimeout(() => {
        setFlip(false);
        setPrevValue(value);
      }, 100); // Animationstid
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  return (
    <div className="flip-unit">
      <div className={`flip-card ${flip ? "flip" : ""}`}>
        <div className="bottom">{flip ? value : prevValue}</div>
        <div className="flip-bottom">{prevValue}</div>
      </div>
    </div>
  );
};

const FlipClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (val) => String(val).padStart(2, "0");

  const formattedDate = time.toLocaleDateString("sv-SE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flip-clock-wrapper">
      <div className="date-display">{formattedDate}</div>
      <div className="flip-clock">
        <FlipUnit unit="Tim" value={format(time.getHours())} />
        <div className="colon">:</div>
        <FlipUnit unit="Min" value={format(time.getMinutes())} />
      </div>
    </div>
  );
};

export default FlipClock;
