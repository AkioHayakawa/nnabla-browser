/* eslint no-prototype-builtins: 0 */
// @ts-nocheck

import { ChartData, ChartDataset } from 'chart.js'
import { ReactiveDataMixin } from '@/types/chart'

function dataHandler (newData: ChartData, oldData: ChartData): void {
  if (oldData) {
    const chart = this.$data._chart

    // Get new and old DataSet Labels
    const newDatasetLabels = newData.datasets.map((dataset: ChartDataset) => {
      return dataset.label
    })

    const oldDatasetLabels = oldData.datasets.map((dataset: ChartDataset) => {
      return dataset.label
    })

    // Stringify 'em for easier compare
    const oldLabels = JSON.stringify(oldDatasetLabels)
    const newLabels = JSON.stringify(newDatasetLabels)

    // Check if Labels are equal and if dataset length is equal
    if (
      newLabels === oldLabels &&
      oldData.datasets.length === newData.datasets.length
    ) {
      newData.datasets.forEach((dataset: ChartDataset, i: number) => {
        // Get new and old dataset keys
        const oldDatasetKeys = Object.keys(oldData.datasets[i])
        const newDatasetKeys = Object.keys(dataset)

        // Get keys that aren't present in the new data
        const deletionKeys = oldDatasetKeys.filter(key => {
          return key !== '_meta' && newDatasetKeys.indexOf(key) === -1
        })

        // Remove outdated key-value pairs
        deletionKeys.forEach(deletionKey => {
          delete chart.data.datasets[i][deletionKey]
        })

        // Update attributes individually to avoid re-rendering the entire chart
        for (const attribute in dataset) {
          if (dataset.hasOwnProperty(attribute)) {
            chart.data.datasets[i][attribute] = dataset[attribute]
          }
        }
      })

      if (newData.hasOwnProperty('labels')) {
        chart.data.labels = newData.labels
        this.$emit('labels:update')
      }
      if (newData.hasOwnProperty('xLabels')) {
        chart.data.xLabels = newData.xLabels
        this.$emit('xlabels:update')
      }
      if (newData.hasOwnProperty('yLabels')) {
        chart.data.yLabels = newData.yLabels
        this.$emit('ylabels:update')
      }
      chart.update()
      this.$emit('chart:update')
    } else {
      if (chart) {
        chart.destroy()
        this.$emit('chart:destroy')
      }
      this.renderChart(this.chartData, this.options)
      this.$emit('chart:render')
    }
  } else {
    if (this.$data._chart) {
      this.$data._chart.destroy()
      this.$emit('chart:destroy')
    }
    this.renderChart(this.chartData, this.options)
    this.$emit('chart:render')
  }
}

export const reactiveData: ReactiveDataMixin = {
  data () {
    return {
      chartData: null
    }
  },

  watch: {
    chartData: dataHandler
  }
}

export const reactiveProp = {
  props: {
    chartData: {
      type: Object,
      required: true,
      default: function (): void {
        /* do nothing */
      }
    }
  },
  watch: {
    chartData: dataHandler
  }
}

export default {
  reactiveData,
  reactiveProp
}
