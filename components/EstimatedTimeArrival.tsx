import { StyleSheet } from 'react-native';

import { MonoText } from './StyledText';
import { View } from './Themed';

import { useState, useEffect } from 'react';

export default function EstimatedTimeArrival({ stop, route }: { stop: string, route: string }) {
  const [etaResult, setEtaResult] = useState([])

  const estimated_time_arrival = async (stop_id:string, route_number:string) => {
    try {
      const response = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/eta/${stop_id}/${route_number}/1`);
      const json = await response.json();
      setEtaResult(json.data.slice(0, 3));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    estimated_time_arrival(stop, route);
  }, []);
  
  return (
    <View>
      <View style={styles.getStartedContainer}>
        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor="rgba(255,255,255,0.05)"
          lightColor="rgba(0,0,0,0.05)">
            {etaResult.map((item, key)=>{
              let etaDate = new Date(item['eta']).getTime();
              let currentDate = new Date().getTime();
              let etatime = Math.round((etaDate - currentDate)/1000/60)
              
              return(
                <MonoText key={key}>{etatime<0?(0):(etatime)}分鐘</MonoText>
              )
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
});
