import { useState, useEffect } from 'react';
import { CloudSun, Sun, Cloud, CloudRain, CloudRainWind, CloudLightning } from 'lucide-react';

export default function useWeather() {
  const [weather, setWeather] = useState({
    temp: '--', feelsLike: '--', humidity: '--', windSpeed: '--', windDir: '--',
    pop: '--', uv: '--', aqi: '--', desc: 'Đang tải...', 
    aqiStatus: 'ĐANG TẢI', aqiColor: 'text-slate-400', aqiBg: 'bg-slate-400/20',
    uvStatus: 'ĐANG TẢI', uvColor: 'text-slate-400', uvBg: 'bg-slate-400/20',
    icon: CloudSun
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Tọa độ Biên Hòa, Đồng Nai
        const weatherRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=10.9574&longitude=106.8427&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&daily=uv_index_max,precipitation_probability_max&timezone=Asia%2FHo_Chi_Minh');
        const wData = await weatherRes.json();

        const aqiRes = await fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=10.9574&longitude=106.8427&current=us_aqi');
        const aqiData = await aqiRes.json();

        // Xử lý Icon và Text thời tiết
        const code = wData.current.weather_code;
        let desc = "Có mây"; let WIcon = CloudSun;
        if (code === 0) { desc = "Trời nắng trong"; WIcon = Sun; }
        else if (code >= 1 && code <= 3) { desc = "Nhiều mây"; WIcon = Cloud; }
        else if (code >= 45 && code <= 48) { desc = "Sương mù"; WIcon = Cloud; }
        else if (code >= 51 && code <= 67) { desc = "Có mưa nhẹ"; WIcon = CloudRain; }
        else if (code >= 80 && code <= 82) { desc = "Mưa rào"; WIcon = CloudRainWind; }
        else if (code >= 95) { desc = "Mưa dông"; WIcon = CloudLightning; }

        // Xử lý hướng gió
        const dir = wData.current.wind_direction_10m;
        const dirs = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
        const windDirText = dirs[Math.round(dir / 45) % 8];

        // Đánh giá AQI
        const currentAqi = Math.round(aqiData.current.us_aqi);
        let aqiStatus = 'TỐT'; let aqiColor = 'text-emerald-400'; let aqiBg = 'bg-emerald-400/20';
        if(currentAqi > 50 && currentAqi <= 100) { aqiStatus = 'T.BÌNH'; aqiColor = 'text-yellow-400'; aqiBg = 'bg-yellow-400/20'; }
        else if(currentAqi > 100) { aqiStatus = 'KÉM'; aqiColor = 'text-rose-400'; aqiBg = 'bg-rose-400/20'; }

        // Đánh giá UV
        const currentUv = wData.daily.uv_index_max[0];
        let uvStatus = 'THẤP'; let uvColor = 'text-emerald-400'; let uvBg = 'bg-emerald-400/20';
        if(currentUv > 2 && currentUv <= 5) { uvStatus = 'T.BÌNH'; uvColor = 'text-yellow-400'; uvBg = 'bg-yellow-400/20'; }
        else if(currentUv > 5) { uvStatus = 'CAO'; uvColor = 'text-rose-400'; uvBg = 'bg-rose-400/20'; }

        setWeather({
          temp: Math.round(wData.current.temperature_2m), feelsLike: Math.round(wData.current.apparent_temperature),
          humidity: wData.current.relative_humidity_2m, windSpeed: Math.round(wData.current.wind_speed_10m),
          windDir: windDirText, pop: wData.daily.precipitation_probability_max[0] || 0,
          uv: currentUv, aqi: currentAqi, desc, icon: WIcon,
          aqiStatus, aqiColor, aqiBg, uvStatus, uvColor, uvBg
        });
      } catch (err) { console.error("Lỗi API Thời tiết:", err); }
    };
    
    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000); // Tự động update mỗi 30p
    return () => clearInterval(interval);
  }, []);

  return weather;
}