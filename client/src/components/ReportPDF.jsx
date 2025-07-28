// components/ReportPDF.jsx
import React from "react";
import { Document, Page, Text, StyleSheet, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  heading: { fontSize: 18, marginBottom: 10 },
  subheading: { fontSize: 12, marginBottom: 10 },
  table: { display: "table", width: "auto", marginTop: 10 },
  row: { flexDirection: "row", borderBottom: 1, borderBottomColor: "#ccc" },
  cell: { flexGrow: 1, padding: 4, fontSize: 10 },
  header: { fontWeight: "bold", backgroundColor: "#eee" },
});

const ReportPDF = ({ config, data, fromDate, toDate }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.heading}>{config.label} Report</Text>
      <Text style={styles.subheading}>
        From: {fromDate} | To: {toDate}
      </Text>

      <View style={styles.table}>
        <View style={[styles.row, styles.header]}>
          {config.columns.map((col, idx) => (
            <Text key={idx} style={styles.cell}>{col}</Text>
          ))}
        </View>

        {data.map((item, index) => (
          <View key={index} style={styles.row}>
            {config.rowMapper(item, index).map((cell, i) => (
              <Text key={i} style={styles.cell}>{cell}</Text>
            ))}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default ReportPDF;
