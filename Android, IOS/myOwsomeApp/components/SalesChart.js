import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  ActivityIndicator,
  FlatList,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { WebView } from 'react-native-webview';
import { Picker } from '@react-native-picker/picker';
import salesData from '../assets/sales_data.json';

const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const summarizeData = (data, dimension, filterProduct) => {
  const grouped = {};
  data.forEach(item => {
    if (filterProduct && item['Product ID'] !== filterProduct) return;

    const key = item[dimension];
    if (!grouped[key]) {
      grouped[key] = 0;
    }
    grouped[key] += item['Total Sale Amount'];
  });

  const summary = Object.entries(grouped).map(([key, value]) => ({
    name: key,
    value: parseFloat(value.toFixed(2)),
  }));

  if (dimension === 'Day of Week') {
    summary.sort((a, b) => dayOrder.indexOf(a.name) - dayOrder.indexOf(b.name));
  }

  return summary;
};

const SalesChart = () => {
  const [dimension, setDimension] = useState('Month');
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [selectedProduct, setSelectedProduct] = useState('All');
  const [allProducts, setAllProducts] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const products = [...new Set(salesData.map(item => item['Product ID']))];
    setAllProducts(products);
  }, []);

  useEffect(() => {
    const summarized = summarizeData(
      salesData,
      dimension,
      selectedProduct === 'All' ? null : selectedProduct
    );
    setChartData(summarized);
    setRawData([]);
    setLoading(false);
  }, [dimension, selectedProduct]);

  const handleMessage = (event) => {
    const clickedName = event.nativeEvent.data;
    const filtered = salesData.filter(item => {
      const matchesDimension = item[dimension] === clickedName;
      const matchesProduct = selectedProduct === 'All' || item['Product ID'] === selectedProduct;
      return matchesDimension && matchesProduct;
    });
    setRawData(filtered);
  };

  const downloadCSV = async () => {
    const csv = [
      Object.keys(salesData[0]).join(','),
      ...rawData.map(row => Object.values(row).join(','))
    ].join('\n');

    const fileUri = FileSystem.documentDirectory + 'sales_data.csv';
    await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });
    await Sharing.shareAsync(fileUri);
  };

  const option = {
    title: {
      text: `Sales by ${dimension}`,
    },
    tooltip: {
      trigger: 'axis',
    },
    dataZoom: [
      { type: 'inside', start: 0, end: 100 },
      { type: 'slider' },
    ],
    xAxis: {
      type: 'category',
      data: chartData.map(d => d.name),
    },
    yAxis: {
      type: 'value',
    },
    series: [{
      name: 'Sales',
      type: chartType,
      data: chartData.map(d => d.value),
    }],
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
    </head>
    <body>
      <div id="chart" style="width:100%;height:500%;"></div>
      <script>
        const chart = echarts.init(document.getElementById('chart'));
        const option = ${JSON.stringify(option)};
        chart.setOption(option);
        chart.on('click', function (params) {
          window.ReactNativeWebView.postMessage(params.name);
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.safeArea}>
      <View style={styles.controls}>
        <Button title="Bar" onPress={() => setChartType('bar')} />
        <Button title="Line" onPress={() => setChartType('line')} />
      </View>

      <View style={styles.pickers}>
        <Picker
          selectedValue={dimension}
          onValueChange={(val) => { setLoading(true); setDimension(val); }}
          style={styles.picker}
        >
          <Picker.Item label="Month" value="Month" />
          <Picker.Item label="Week" value="Week" />
          <Picker.Item label="Day" value="Day" />
          <Picker.Item label="Day of Week" value="Day of Week" />
        </Picker>

        <Picker
          selectedValue={selectedProduct}
          onValueChange={(val) => { setLoading(true); setSelectedProduct(val); }}
          style={styles.picker}
        >
          <Picker.Item label="All Products" value="All" />
          {allProducts.map(product => (
            <Picker.Item key={product} label={`Product ${product}`} value={product} />
          ))}
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <WebView
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            onMessage={handleMessage}
            style={styles.webView}
            javaScriptEnabled
          />

          {rawData.length > 0 && (
            <View style={styles.rawDataContainer}>
              <Text style={styles.rawTitle}>Raw Data ({rawData.length} records)</Text>
              <TouchableOpacity onPress={downloadCSV} style={styles.downloadButton}>
                <Text style={styles.downloadText}>Download CSV</Text>
              </TouchableOpacity>
              <FlatList
                data={rawData}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                  <Text style={styles.rawItem}>
                    {item['Sale ID']} - {item['Product ID']} - {item['Total Sale Amount']}
                  </Text>
                )}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  pickers: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  webView: {
    height: 300,
    marginVertical: 10,
  },
  rawDataContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  rawTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  rawItem: {
    fontSize: 13,
    marginBottom: 2,
  },
  downloadButton: {
    backgroundColor: '#007BFF',
    padding: 6,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  downloadText: {
    color: '#fff',
  }
});

export default SalesChart;
