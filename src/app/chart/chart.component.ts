import {Component, OnInit} from '@angular/core';
import {BarChartModule, PieChartModule} from "@swimlane/ngx-charts";
import {FlexModule} from "@angular/flex-layout";

interface ChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    BarChartModule,
    PieChartModule,
    FlexModule
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit {

  chartData: ChartData[] = [
    { name: 'Germany', value: 8940000 },
    { name: 'USA', value: 5000000 },
    { name: 'UK', value: 3214000 },
    { name: 'France', value: 6543000 },
  ];

  public view: [number, number] = [350, 300];

  // Optional configurations for the chart
  public colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B46C', '#D62728']
  };
  xAxisLabel = 'Country';
  yAxisLabel = 'Population (Millions)';
  showDataLabel = true;

  constructor() { }

  ngOnInit() {
  }
}
