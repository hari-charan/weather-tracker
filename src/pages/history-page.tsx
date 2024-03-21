import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy.js";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated.js";
import { useEffect, useRef, useState } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface ResponseType {
  history: Record[]
}

interface Record {
  time: string
  temprature: number
}

const HistoryPage = () => {
    const rootRef = useRef<am5.Root | null>(null);
  let [data, setData] = useState<any>(null);
  let [userName, setUserName] = useState<string>("");
  let navigate = useNavigate();

  let fetchHistory: (userName: string)  => Promise<Record[]> = async (userName: string) => {
    let response = await axios.get<ResponseType>("http://localhost:8080/get/history?user_name="+userName);
    return response.data.history;
  }

  let getLineChart = (data: any, xField: string, yField: string) => {
    if (rootRef.current) {
        rootRef.current.dispose()   
    }
    rootRef.current = am5.Root.new("line_chart");
    rootRef.current.setThemes([am5themes_Animated.new(rootRef.current)]);
    
    let root = rootRef.current;

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panY: true,
        panX: true,
        wheelY: "zoomX",
        layout: root.verticalLayout,
      })
    );

    // Craete Y-axis
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.2,
        renderer: am5xy.AxisRendererX.new(root, {}),
        categoryField: "time",
      })
    );
    xAxis.get("renderer").labels.template.setAll({
      oversizedBehavior: "wrap",
      maxWidth: 100

    })

    xAxis.data.setAll(data);

    let series = chart.series.push(
      am5xy.LineSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: yField,
        categoryXField: xField,
        stacked: true,
      })
    );
    series.strokes.template.setAll({
      strokeWidth: 2
    });
    // series.fills.template.setAll({
    //   fillOpacity: 0.5,
    //   visible: true,
    // });
    series.data.setAll(data);
  };

  useEffect(() => {
    console.log("entered");
    if(data) getLineChart(data, "time", "asia");
  }, []);

  useEffect(() => {
    if(data) getLineChart(data, "time", "temperature");
  }, [data]);

  return (
    <div className="history-container">
        <button onClick={() => navigate("/")} className="custom-button"> Home </button>
        <div className="input-container">
          <form onSubmit={async (e) => {
            e.preventDefault();
            let resp = await fetchHistory(userName);
            console.log(resp)
            setData(resp)
          }}>
            <span className="heading block">Schedule</span>
            <label htmlFor="user_name" className="subheading">
              User name
            </label>
            <input type="text" id="user_name" onChange={(e) => {
              setUserName(e.target.value);
            }} className="input-field" />
            
            <button className="custom-button" type = "submit"> Fetch History</button>
              </form>
        </div>
      <div id="line_chart"> </div>
    </div>
  );
};

export default HistoryPage;
