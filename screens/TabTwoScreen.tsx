import { StyleSheet, Pressable, FlatList } from 'react-native';
import { Text, View } from '../components/Themed';
import { useState, useEffect } from 'react';
import { RootTabScreenProps } from '../types';

import SearchBar from '../components/SearchBar';
import IncomingBusRoute from '../components/IncomingBusRoute';

export default function TabTwoScreen({ navigation }: RootTabScreenProps<'TabTwo'>) {
  const [query, setQuery] = useState('');
  const [stops, setStops] = useState(new Map());
  const [stopIDs, setStopIDs] = useState(new Map());
  const [searchResult, setSearchResult] = useState([])
  const [isFetching, setIsFetching] = useState(false);

  const handleSearch = (queryText: string) => {
    setQuery(queryText);
  };

  const getStopsName = async () => {
    try {
      const response = await fetch('https://data.etabus.gov.hk/v1/transport/kmb/stop');
      const json = await response.json();
      
      const stopMap = new Map();
      const idMap = new Map();

      const stopdata = json.data;
      stopdata.map((item:any)=>{
        if(stopMap.has(item.name_tc)){
          stopMap.get(item.name_tc).push(item.stop);
        }
        else{
          stopMap.set(item.name_tc, [item.stop]);
        }
        idMap.set(item.stop, item.name_tc)
      });
      setStops(stopMap);
      setStopIDs(idMap);
    } catch (error) {
      console.error(error);
    }
  };

  const searchStop = () =>{
    if(query != '' && !query.includes(' ')){
      const stopNames = [...stops.keys()].filter(k => k.includes(query));
      const stopIDs = stopNames.map((name)=>{
        return stops.get(name)
      });
      const IDs = [].concat(...stopIDs);
      setSearchResult(IDs);
    }
  };

  useEffect(() => {
    getStopsName();
  }, []);

   // flatlist item
   const renderItem = ({item}: {item: string}) => (
    <Pressable style={styles.item} onPress={() => navigation.navigate('車站', {stopID: item, stopName: stopIDs.get(item)})}>
        <Text style={styles.title}>{stopIDs.get(item)}</Text>
        <IncomingBusRoute stopID={item}/>
    </Pressable>
  );

  const onRefresh = async () => {
    setIsFetching(true);
    getStopsName();
    setIsFetching(false);
  };

  return (
    <View style={styles.container}>
        <SearchBar handleSearch={handleSearch}/>
        <Pressable style={styles.btn} onPress={()=>{searchStop()}}>
          {({ pressed }) => (
            <View style={[{backgroundColor: pressed ? 'rgb(205, 230, 255)' : 'white'}, styles.txt]}>
              <Text>
                確認
              </Text>
            </View>
          )}
        </Pressable>
        <View style={styles.stopList}>
            <FlatList
              data={searchResult}
              renderItem={renderItem}
              initialNumToRender={10}
              keyExtractor={(item: string, index: number) => index.toString()}
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  txt: {
    borderWidth: 1,
    borderRadius: 8,
    width: '20%',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopList: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  item: {
    backgroundColor: '#fff',
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
