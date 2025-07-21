import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Button, Share } from 'react-native';
import { getStockReport } from '../services/backendService';
import Markdown from 'react-native-markdown-display';
import { useRoute } from '@react-navigation/native'; // If using React Navigation

type ReportScreenRouteParams = {
  stockId: string;
};

const ReportScreen = () => {
  const route = useRoute();
  const { stockId } = route.params as ReportScreenRouteParams;
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const report = await getStockReport(stockId);
        setReportContent(report);
      } catch (err) {
        console.error("Failed to fetch report:", err);
        setError("Failed to load report. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [stockId]);

  const onShare = async () => {
    try {
      if (reportContent) {
        await Share.share({
          message: reportContent,
          title: `Oshan Equity Insights - Report for ${stockId}`,
        });
      }
    } catch (shareError) {
      console.error('Error sharing report:', shareError);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Generating report...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Button onPress={onShare} title="Share Report" />
      {reportContent ? (
        <Markdown style={markdownStyles}>{reportContent}</Markdown>
      ) : (
        <Text>No report content available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

const markdownStyles = StyleSheet.create({
  // Basic markdown styles, customize as needed
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  heading3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 12,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  list_item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  bullet_list: {
    marginBottom: 10,
  },
  code_block: {
    fontFamily: 'monospace',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  hr: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  blockquote: {
    borderLeftColor: '#ccc',
    borderLeftWidth: 4,
    paddingLeft: 10,
    marginLeft: 5,
    marginBottom: 10,
  },
});


export default ReportScreen;