import { LitElement, html } from '@polymer/lit-element';

import { PaperFontStyles } from './shared-styles.js'
import { WidgetCard } from './widget-card.js'
import { BaseSocketioDeviceClient } from '../socketio-device-client.js'

import * as d3 from "d3";

import '@polymer/paper-button/paper-button.js';

import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';

import '@polymer/paper-tooltip/paper-tooltip.js';

import '@vaadin/vaadin-select/vaadin-select.js';
import '@vaadin/vaadin-item/vaadin-item.js';
import '@vaadin/vaadin-list-box/vaadin-list-box.js';

class MirrorWidgetClient extends BaseSocketioDeviceClient {
  constructor (address, component) {
    super(address, component)
  }

  on_data_change(data) {
  }
}

class MirrorWidget extends WidgetCard {
  constructor() {
    super()
    this.socketioClient = new MirrorWidgetClient("http://localhost:5000", this)
    this.name = 'Mirror View'

    this.mirror = "Primary"
    this._allMirrors = ["Primary", "Secondary", "Other"]

    this.viewMode = ""
    this._allViewModes = ["","Internal Temperature", "External Temperature", "Total Misalignment"]

    this.SVG_WIDTH = 0
    this.SVG_HEIGHT = 0

    this.panelObjects = null

    // Hardcoded properties
    this.ALL_PANEL_NUMBERS = {
      P1: ['1414', '1413', '1412', '1411',
        '1314', '1313', '1312', '1311',
        '1214', '1213', '1212', '1211',
        '1114', '1113', '1112', '1111'],
      P2: ['1428', '1427', '1426', '1425', '1424', '1423', '1422', '1421',
        '1328', '1327', '1326', '1325', '1324', '1323', '1322', '1321',
        '1228', '1227', '1226', '1225', '1224', '1223', '1222', '1221',
        '1128', '1127', '1126', '1125', '1124', '1123', '1122', '1121'],
      S1: ['2412', '2411','2312', '2311',
        '2212', '2211',  '2112', '2111'],
      S2: ['2424', '2423', '2422', '2421',
        '2324', '2323', '2322', '2321',
        '2224', '2223', '2222', '2221',
        '2124', '2123', '2122', '2121'],
      Other: ['0']
    }

    this.PANEL_GEOMETRY = {
      P1: {
        center: { x: 2825.3289, y: 0.0 },
        vertices: [
          { x: 2151.3557, y: -427.9312 },
          { x: 3334.6713, y: -663.3074 },
          { x: 3400.0013, y: 0.0 },
          { x: 3334.6713, y: 663.3074 },
          { x: 2151.3557, y: 427.9312 }
        ],
        referencePointsPanel: [
          { x: 2507.1922, y: 0.0 },
          { x: 2984.3973, y: -277.1281 },
          { x: 2984.3973, y: 277.1281 }
        ],
        referencePointsBack: [
          { x: 3143.4656667, y: 0.0 },
          { x: 2666.2606, y: -277.1281 },
          { x: 2666.2606, y: 277.1281 }
        ],
        mpes_attachment_points: {
          '1L': { x: 2352.01, y: -401.487 },
          '1W': { x: 2452.11, y: 444.902 },
          '2L': { x: 2764.55, y: 456.063 },
          '2W': { x: 2758.18, y: -488.03 },
          '3L': { x: 3166.33, y: -563.552 },
          '3W': { x: 3057.53, y: 565.273 },
          '4L': { x: 3280.72, y: -561.592 },
          '5W': { x: 3349.11, y: -113.243 },
          "4'L": { x: 3327.25, y: 89.236 },
          "5'W": { x: 3306.85, y: 542.313 }
        }
      },
      P2: {
        center: { x: 4132.7017, y: 0.0 },
        vertices: [
          { x: 3383.6294, y: -333.2584 },
          { x: 4808.6082, y: -473.6066 },
          { x: 4808.6082, y: 473.6066 },
          { x: 3383.6294, y: 333.2584 }
        ],
        referencePointsPanel: [
          { x: 3816.1544, y: 0.0 },
          { x: 4290.9753, y: -277.1281 },
          { x: 4290.9753, y: 277.1281 }
        ],
        referencePointsBack: [
          { x: 4449.2489, y: 0.0 },
          { x: 4132.7017, y: -277.1281 },
          { x: 4132.7017, y: 277.1281 }
        ],
        mpes_attachment_points: {
          '4W': { x: 3431.65, y: -135.86 },
          '5L': { x: 3455.77, y: 114.147 },
          '6L': { x: 3494.92, y: -278.845 },
          '6W': { x: 3598.35, y: 312.159 },
          '7L': { x: 4109.69, y: 312.288 },
          '7W': { x: 4106.48, y: -344.724 },
          '8L': { x: 4718.87, y: -399.674 },
          '8W': { x: 4611.25, y: 411.746 }
        }
      },
      S1: {
        center: { x: 1115.7017, y: 0.0 },
        vertices: [
          { x: 364.5846, y: 151.0159 },
          { x: 1474.9636, y: 610.9499 },
          { x: 1596.4891, y: 0.0 },
          { x: 1474.9636, y: -610.9499 },
          { x: 364.5846, y: -151.0159 }
        ],
        referencePointsPanel: [
          { x: 799.9935, y: 0.0 },
          { x: 1273.1926, y: 277.1281 },
          { x: 1273.1926, y: -277.1281 }
        ],
        referencePointsBack: [
          { x: 1430.9256, y: 0.0 },
          { x: 1115.4596, y: 277.1281 },
          { x: 1115.4596, y: -277.1281 }
        ],
        mpes_attachment_points: {
          '1L': { x: 564.599, y: -163.227 },
          '1W': { x: 654.18, y: 225.589 },
          '2L': { x: 959.968, y: 297.984 },
          '2W': { x: 947.410, y: -328.073 },
          '3L': { x: 1333.310, y: -482.099 },
          '3W': { x: 1227.69, y: 462.843 },
          '4L': { x: 1439.98, y: -501.603 },
          '5W': { x: 1542.45, y: -112.756 },
          "4'L": { x: 1522.32, y: 87.636 },
          "5'W": { x: 1468.19, y: 486.098 }
        }
      },
      S2: {
        center: { x: 2180.8377, y: 0.0 },
        vertices: [
          { x: 1565.8130, y: 311.4596 },
          { x: 2656.1201, y: 528.3351 },
          { x: 2656.1201, y: -528.3351 },
          { x: 1565.8130, y: -311.4596 }
        ],
        referencePointsPanel: [
          { x: 1878.2451, y: 0.0 },
          { x: 2332.1339, y: 277.1281 },
          { x: 2332.1339, y: -277.1281 }
        ],
        referencePointsBack: [
          { x: 2483.4302, y: 0.0 },
          { x: 2180.8376, y: 277.1281 },
          { x: 2180.8376, y: -277.1281 }
        ],
        mpes_attachment_points: {
          '4W': { x: 1624.04, y: -114.255 },
          '5L': { x: 1648.71, y: 93.783 },
          '6L': { x: 1678.86, y: -267.202 },
          '6W': { x: 1775.62, y: 310.576 },
          '7L': { x: 2140.40, y: 331.887 },
          '7W': { x: 2133.86, y: -363.829 },
          '8L': { x: 2588.06, y: -449.052 },
          '8W': { x: 2486.34, y: 451.305 }
        }
      },
      Other: {
        center: { x: 1115.7017, y: 0.0 },
        vertices: [
          { x: 364.5846, y: 151.0159 },
          { x: 1474.9636, y: 610.9499 },
          { x: 1596.4891, y: 0.0 },
          { x: 1474.9636, y: -610.9499 },
          { x: 364.5846, y: -151.0159 }
        ],
        referencePointsPanel: [
          { x: 799.9935, y: 0.0 },
          { x: 1273.1926, y: 277.1281 },
          { x: 1273.1926, y: -277.1281 }
        ],
        referencePointsBack: [
          { x: 1430.9256, y: 0.0 },
          { x: 1115.4596, y: 277.1281 },
          { x: 1115.4596, y: -277.1281 }
        ],
        mpes_attachment_points: {
          '1L': { x: 564.599, y: -163.227 },
          '1W': { x: 654.18, y: 225.589 },
          '2L': { x: 959.968, y: 297.984 },
          '2W': { x: 947.410, y: -328.073 },
          '3L': { x: 1333.310, y: -482.099 },
          '3W': { x: 1227.69, y: 462.843 },
          '4L': { x: 1439.98, y: -501.603 },
          '5W': { x: 1542.45, y: -112.756 },
          "4'L": { x: 1522.32, y: 87.636 },
          "5'W": { x: 1468.19, y: 486.098 }
        }
      },
    }

    this.panelTypes = {
      Primary: ["P1", "P2"],
      Secondary: ["S1", "S2"],
      Other: ["Other"],
    }

    // One-time computation of hardcoded mirror geometry
    this.computeMirrorGeometry()

    this.socketioClient.connect()
    this.socketioClient.request_all_data("types", ["Panel"])
  }

  static get properties() {
    return {
      name: { type: String },
      mirror: { type: String },
      viewMode: { type: String },
      currentPanels: { type: Array }
    }
  }

  get contentTemplate() {
    return html`
    <style>
    .mirror-svg {
      width: 80%;
      height: 100%;
      border-style: solid;
      display: inline-block;
    }
    .legend-svg {
      width: 15%;
      display: inline-block;
    }
    </style>
    <div class="mirror-header paper-font-headline">${this.name}</div>
    <vaadin-select value="${this.viewMode}" @value-changed="${this._changeViewMode}">
      <template>
        <vaadin-list-box>
          ${this._allViewModes.map(i => html`<vaadin-item value="${i}">${i}</vaadin-item>`)}
        </vaadin-list-box>
      </template>
    </vaadin-select>
    <div class="mirror-body">
    <svg class="mirror-svg" preserveAspectRatio="xMidYMidmeet" viewBox="0 0 ${this.SVG_WIDTH} ${this.SVG_HEIGHT}"></svg><svg class="legend-svg"></svg>
    </div>
    <paper-tooltip hidden id="tooltip">
      <div class="paper-font-body1" id="tooltip-device-name">${this.tooltipTarget}</div>
      <div class="paper-font-body1" id="tooltip-device-info">${this.tooltipContent}</div>
    </paper-tooltip>
    `;
  }

  get actionsTemplate() {
    return html`
    <paper-radio-group selected="${this.mirror}" @selected-changed= "${this._changeMirror}">
      ${this._allMirrors.map(i => html`<paper-radio-button name="${i}">${i}</paper-radio-button>`)}
    </paper-radio-group>
    `
  }

  // Geometric computations (positions)

  _rotatePoint (point, theta) {
    var x = point.x
    var y = point.y

    var rotX = Math.cos(theta) * x - Math.sin(theta) * y
    var rotY = Math.sin(theta) * x + Math.cos(theta) * y

    return { x: rotX, y: rotY }
  }

  computeMirrorGeometry () {
    this.panelPositions = {}
    for (let mirror of this._allMirrors) {
      if (!this.panelPositions.hasOwnProperty(mirror)) {
        this.panelPositions[mirror] = {}
      }
      for (let panelType of this.panelTypes[mirror]) {
        var panelNumbers = this.ALL_PANEL_NUMBERS[panelType]
        var panelGeometry = this.PANEL_GEOMETRY[panelType]

        for (var i = 0; i < panelNumbers.length; i++) {
          var panelNumber = panelNumbers[i]
          this.panelPositions[mirror][panelNumber] = {}

          var theta = 2 * Math.PI * ((i + 0.5) / panelNumbers.length)
          for (let pointType of ['vertices', 'referencePointsPanel', 'referencePointsBack']) {
            this.panelPositions[mirror][panelNumber][pointType] = panelGeometry[pointType].map(x => this._rotatePoint(x, theta))
          }
        }
      }
    }
  }


  // Setting data

  setAllData(data) {
    // Update
    if (this.panelObjects) {
      this.setPanelData(data.Panel)
      this.updateSVG()
    }
    // Render first time
    else {
      this.setPanelData(data.Panel)
      this.renderSVG()
    }
  }

  setPanelData(panelData) {
    this._allPanels = {}

    for (let mirror of this._allMirrors) {
      if (!this._allPanels.hasOwnProperty(mirror)) {
        this._allPanels[mirror] = []
      }
      for (var panelNumber in this.panelPositions[mirror]) {
        var matchingPanelData = Object.values(panelData).find(x => x.position_info.panel_number === panelNumber)
        let panelObject
        if (typeof matchingPanelData !== 'undefined') {
          panelObject = Object.assign({}, {
            id: "panel_" + panelNumber,
            deviceName: "Panel " + panelNumber,
            panelNumber: panelNumber,
            deviceID: matchingPanelData.id,
            InternalTemperature: matchingPanelData.data.InternalTemperature,
            ExternalTemperature: matchingPanelData.data.ExternalTemperature
          })
          Object.assign(panelObject, this.panelPositions[mirror][panelNumber])
        }
        else {
          panelObject = Object.assign({}, {
            id: "panel_" + panelNumber,
            deviceName: "Panel " + panelNumber,
            panelNumber: panelNumber,
            deviceID: null,
            InternalTemperature: null,
            ExternalTemperature: null
          })
          Object.assign(panelObject, this.panelPositions[mirror][panelNumber])
        }
        this._allPanels[mirror].push(panelObject)
      }
  }
  this.currentPanels = this._allPanels[this.mirror]
  this.computeXYScales()
  if (this.viewMode !== "") {
    this.computeColorScale()
  }
}

  // Custom D3.js scales

  computeXYScales () {
    var min_x = d3.min(this.currentPanels, function (d) { return d3.min(d.vertices, function (e) { return e.x }) })
    var max_x = d3.max(this.currentPanels, function (d) { return d3.max(d.vertices, function (e) { return e.x }) })

    var min_y = d3.min(this.currentPanels, function (d) { return d3.min(d.vertices, function (e) { return e.y }) })
    var max_y = d3.max(this.currentPanels, function (d) { return d3.max(d.vertices, function (e) { return e.y }) })

    this.xScale = d3.scaleLinear()
      .domain([min_x, max_x])
      .range([this.SVG_WIDTH * 0.2, this.SVG_WIDTH * 0.8])

    this.yScale = d3.scaleLinear()
      .domain([min_y, max_y])
      .range([this.SVG_HEIGHT * 0.2, this.SVG_HEIGHT * 0.8])
  }

  computeColorScale () {
    this._colorScaleMin = Number.MAX_VALUE
    this._colorScaleMax = -1 * Number.MAX_VALUE

    for (let panel of this.currentPanels) {
      if (this.viewMode === "Internal Temperature") {
        var value = panel.InternalTemperature
        var scaleType = d3.interpolateRdYlBu
      }
      else if (this.viewMode === "External Temperature") {
        var value = panel.ExternalTemperature
        var scaleType = d3.interpolateRdYlBu
      }

      if (value !== null) {
        if (value < this._colorScaleMin) {
          this._colorScaleMin = value - 0.01
        }
        else if (value > this._colorScaleMax) {
          this._colorScaleMax = value + 0.01
      }
    }
  }

    this.colorScale = d3.scaleSequential(scaleType)
    .domain([this._colorScaleMax, this._colorScaleMin])
  }

  // Tooltip

  updateTooltip (d, i, group) {
    this.tooltipDiv.querySelector('#tooltip-device-name').innerHTML = d.deviceName
    this.tooltipDiv.querySelector('#tooltip-device-info').innerHTML = this.getTooltipContent(d)
    this.tooltipDiv.for = d.id
  }

  getTooltipContent (d) {
    if (this.viewMode === "Internal Temperature") {
      return "Internal Temperature: " + d.InternalTemperature
    }
    else if (this.viewMode === "External Temperature") {
      return "External Temperature: " + d.ExternalTemperature
    }
    else {
      return ""
    }
  }

  // Device highlghting

  addHighlight (d, i, group) {
    d3.select(group[i])
      .style('stroke-width', 0.6)
      .style('stroke', 'blue')
  }

  removeHighlight (d, i, group) {
    d3.select(group[i])
      .style('stroke-width', 0.1)
      .style('stroke', 'black')
  }

  // Panel fill
  getPanelFill(d, i, group) {
    if (d.deviceID === null) {
      return 'gray'
    }
    else {
      if (this.viewMode === "Internal Temperature") {
        console.log(this.colorScale)
        return this.colorScale(d.InternalTemperature)
      }
      else if (this.viewMode === "External Temperature") {
        console.log(this.colorScale)
        return this.colorScale(d.ExternalTemperature)
      }
      else {
        return 'transparent'
      }
    }
  }

  getPanelOpacity(d, i, group) {
    if (d.deviceID === null) {
      return '0.3'
    }
    else {
      return '0.6'
    }
  }

  // Render methods (to be called after DOM update)
  renderSVG () {
    this.renderPanels()
    this.renderColorLegend()
  }

  renderPanels () {
    var svg = this.shadowRoot.querySelector(".mirror-svg")
    // Clear previous contents
    d3.select(svg).selectAll("*").remove()
    this.panelObjects = d3.select(svg).selectAll('polygon')
      .data(this.currentPanels, function (d) { return d.panelNumber} )
      .enter()
      .append('polygon')
      .attr('id', d => {return d.id})
      .attr('points', d => {
        return d.vertices.map(
          e => {
            return [this.xScale(e.x), this.yScale(e.y)].join(',')
          }
        ).join(' ')
      })
      .style('fill', this.getPanelFill.bind(this))
      .style('fill-opacity', this.getPanelOpacity.bind(this))
      .style('stroke', 'black')
      .style('stroke-width', 0.1)
      .attr('pointer-events', 'all')
      .on('click', (d, i, group) => {
        this._onClickDevice(d)
      })
      .on('mouseover', (function (d, i, group) {
        this.addHighlight(d, i, group)
        this.updateTooltip(d, i, group)
      }).bind(this))
      .on('mouseout', (function (d, i, group) {
        this.removeHighlight(d, i, group)
      }).bind(this))
  }

   _linspace(start, end, n) {
        var out = [];
        var delta = (end - start) / (n - 1);

        var i = 0;
        while(i < (n - 1)) {
            out.push(start + (i * delta));
            i++;
        }

        out.push(end);
        return out;
    }

  renderColorLegend () {
    var svg = this.shadowRoot.querySelector(".legend-svg")
    d3.select(svg).selectAll("*").remove()
    if (this.viewMode !== "") {
      var w = this.LEGEND_WIDTH*0.2
      var h = this.LEGEND_HEIGHT*0.8

      var colorLegendObject = d3.select(svg)
          .attr('width', w)
          .attr('height', h)
          .append('g')
          .attr('transform', 'translate(' + this.LEGEND_WIDTH*0.1 + ',' + this.LEGEND_HEIGHT*0.1 + ')')

        if ((this.viewMode === "Internal Temperature") || (this.viewMode === "External Temperature")) {
          var colorScale = d3.schemeRdYlBu[10].slice().reverse()
        }
        else {
          var colorScale = d3.schemeRdYlBu[10].slice().reverse()
        }


        var gradient = colorLegendObject.append('defs')
            .append('linearGradient')
            .attr('id', 'gradient')
            .attr('x1', '0%') // bottom
            .attr('y1', '100%')
            .attr('x2', '0%') // to top
            .attr('y2', '0%')
            .attr('spreadMethod', 'pad')

        var pct = this._linspace(0, 100, colorScale.length).map(function(d) {
            return Math.round(d) + '%';
        });

        var colourPct = d3.zip(pct, colorScale)

        colourPct.forEach(function(d) {
            gradient.append('stop')
                .attr('offset', d[0])
                .attr('stop-color', d[1])
                .attr('stop-opacity', 1);
        });

        colorLegendObject.append('rect')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('width', w)
            .attr('height', h)
            .style('fill', 'url(#gradient)');

        // create a scale and axis for the legend
        var colorLegendScale = d3.scaleLinear()
            .domain([this._colorScaleMin, this._colorScaleMax])
            .range([h, 0]);

        var colorLegendAxis = d3.axisRight(colorLegendScale)
            .tickValues(d3.range(this._colorScaleMin, this._colorScaleMax, (this._colorScaleMax-this._colorScaleMin)/20))
            .tickFormat(d3.format(".2f"));

        colorLegendObject.append("g")
            .attr("class", "legend axis")
            .attr("transform", "translate(" + w + ", 0)")
            .call(colorLegendAxis);
    }
  }

  updateSVG () {
    this.updatePanels()
    this.renderColorLegend()
  }

  updatePanels() {
    var updatedPanels = this.panelObjects
    .data(this.currentPanels, function(d, i) { return d.panelNumber; })

    // Assume no panels added or removed
    //updatedPanels.exit().remove()
    //updatedPanels.enter().append("circle")

    updatedPanels.transition()
      .duration(100)
      .style('fill', this.getPanelFill.bind(this))
      .style('fill-opacity', this.getPanelOpacity.bind(this))
  }

  // Lit Element lifecycle methods)

  firstUpdated(changedProps) {
    this.tooltipDiv = this.shadowRoot.querySelector('#tooltip')

    this.SVG_WIDTH = this.shadowRoot.querySelector(".mirror-svg").scrollWidth
    this.SVG_HEIGHT = this.SVG_WIDTH

    this.shadowRoot.querySelector(".mirror-svg").style.height = this.SVG_HEIGHT + "px"

    var svg = this.shadowRoot.querySelector(".mirror-svg")
    d3.select(svg).attr("viewBox", "0 0 " + this.SVG_WIDTH + " " + this.SVG_HEIGHT)

    this.LEGEND_WIDTH = this.shadowRoot.querySelector(".legend-svg").scrollWidth
    this.LEGEND_HEIGHT = this.SVG_HEIGHT

    this.shadowRoot.querySelector(".legend-svg").style.height = this.LEGEND_HEIGHT + "px"
  }

  updated(changedProps) {
  }

  // Event Handlers

  _changeViewMode (e) {
    this.viewMode = e.detail.value
    if (this.viewMode !== "") {
      this.socketioClient.request_all_data("types", ["Panel"])
    }
  }

  _changeMirror (e) {
    this.panelObjects = null
    this.mirror = e.detail.value
    if (this.currentPanels) {
      this.socketioClient.request_all_data("types", ["Panel"])
    }
  }

  _onClickDevice(data){
    var event = new CustomEvent('changed-selected-device', { detail: data.deviceID });
    this.dispatchEvent(event);
}

  _onRefreshButtonClicked(e) {
    this.socketioClient.request_all_data("types", ["Panel"])
  }
}

window.customElements.define('mirror-widget', MirrorWidget)
