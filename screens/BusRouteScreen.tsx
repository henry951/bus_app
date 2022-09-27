import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, FlatList } from 'react-native';
import { Text, View } from '../components/Themed';
import { useState, useEffect } from 'react';

import EstimatedTimeArrival from '../components/EstimatedTimeArrival';

import { patchFlatListProps } from 'react-native-web-refresh-control';

export default function BusRouteScreen(route: any) {
  const {busRoute, bound, dest_tc} = route.route.params

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [stops, setStops] = useState(new Map());

  const [isFetching, setIsFetching] = useState(false);
  
  interface Stops {
    route: string;
    stop:string;
  }

  const getBusStops = async () => {
    try {
      let url = ''
      if(bound == 'O'){
        url = `https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${busRoute}/outbound/1`;
      }
      if(bound == 'I'){
        url = `https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${busRoute}/inbound/1`;
      }
      const response = await fetch(url);
      const json = await response.json();
      setData(json.data);
    } catch (error) {
      console.error(error);
    }
  }

  const getStopsName = async () => {
    try {
      const response = await fetch('https://data.etabus.gov.hk/v1/transport/kmb/stop');
      const json = await response.json();
      
      const stopMap = new Map();  
      const stopdata = json.data;
      stopdata.map((item:any)=>{
        stopMap.set(item.stop, item.name_tc);
      });
      setStops(stopMap);
    } catch (error) {
      console.error(error);
    } finally { 
      setLoading(false);
    }
  }

  useEffect(() => {
    getStopsName();
    getBusStops();
  }, []);

  // flatlist item
  const renderItem = ({ item }: { item: Stops }) => {
    return(
        <View style={styles.item}>
            <Text style={styles.title}>{stops.get(item.stop)}</Text>
            <EstimatedTimeArrival stop={item.stop} route={item.route}/>
        </View>
    )
  }

  const onRefresh = async () => {
    setIsFetching(true);
    getBusStops();
    setIsFetching(false);
  };

  patchFlatListProps();

  return (
    <View style={styles.container}>
      <View style={styles.routeNumber}>
        <Text style={styles.title}>{busRoute}路線 往{dest_tc}方向</Text>
      </View>
      <View style={styles.stopList}>
            <FlatList
              data={data}
              renderItem={renderItem}
              initialNumToRender={10}
              keyExtractor={(item: object, index: number) => index.toString()}
              onRefresh={onRefresh}
              refreshing={isFetching}
            />
      </View>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  routeNumber: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
  },
  stopList: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});