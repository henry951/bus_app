import { StyleSheet, Text, View, Pressable, FlatList} from 'react-native';
import { useState, useEffect } from 'react';
import { RootTabScreenProps } from '../types';

import SearchBar from '../components/SearchBar';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setfilteredData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  
  const [ref, setRef] = useState(null as any);
1 

  interface Route {
      bound:string;
      dest_tc:string;
      orig_tc:string;
      route:string;
    }

  // fetch data when the app first loaded
  const getBusRoutes = async () => {
      try {
      const response = await fetch('https://data.etabus.gov.hk/v1/transport/kmb/route/', {mode: 'cors'});
      const json = await response.json();
      setData(json.data);
      setfilteredData(json.data)
      } catch (error) {
      console.error(error);
      } finally {
      setLoading(false);
      }
  }

  useEffect(() => {
      getBusRoutes();
  }, []);

  // for textInput
  const handleSearch = (queryText: string) => {
      setfilteredData(data.filter((item: Route) =>item.route.includes(queryText)));
      ref.scrollToOffset({ animated: true, offset: 0 });
  };
  
  const onRefresh = async () => {
    setIsFetching(true);
    getBusRoutes();
    setIsFetching(false);
  };

  // flatlist item
  const renderItem = ({ item }: { item: Route }) => (
      <Pressable style={styles.item} onPress={() => navigation.navigate('巴士', {busRoute: item.route, bound: item.bound, dest_tc: item.dest_tc})}>
          <Text style={styles.title}>{item.route}</Text>
          <Text>{item.orig_tc} 往 {item.dest_tc} </Text>
      </Pressable>
  );

  return (
    <View style={styles.container}>
        <SearchBar handleSearch={handleSearch}/>
        <View style={styles.routeList}>
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              initialNumToRender={10}
              keyExtractor={(item: object, index: number) => index.toString()}
              ref={(ref: any) => setRef(ref)}
              onRefresh={onRefresh}
              refreshing={isFetching}
            />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  routeList: {
    flex: 1,
  },
  item: {
    backgroundColor: '#fff',
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 28,
  },
});
