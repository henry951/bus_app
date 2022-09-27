import { MonoText } from './StyledText';
import { View, Text } from './Themed';
import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';

export default function IncomingBusRoute({stopID}:{stopID : string}) {
    const [eba, setEba] = useState([]);

    const estimated_bus_arrival = async (stop_id:string) => {
        try {
                const response = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop-eta/${stop_id}`);
                const json = await response.json();
                const busData = json.data;

                const busMap = new Map();
                busData.map((item: any)=>{
                    if(busMap.has(item.route)){
                        busMap.set(item.route, {'route': item.route, 'dest_tc': item.dest_tc, count: busMap.get(item.route).count + 1})
                    }
                    else{
                        busMap.set(item.route, {'route': item.route, 'dest_tc': item.dest_tc, count: 1})
                    }
                })
                
                const twoDarray = [...busMap.values()];
                const array = [].concat(...twoDarray);
                setEba(array);

            } catch (error) {
                console.error(error);
        }
    }
    
    useEffect(() => {
        estimated_bus_arrival(stopID);
    }, [stopID]);

    return(
        <View>
            {   
                eba.map((bus, key)=>{
                    return(
                        <MonoText key={key}>
                            {bus['route']} 往
                            <Text>{' '}</Text>
                            <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
                                darkColor="rgba(255,255,255,0.05)"
                                lightColor="rgba(0,0,0,0.05)">
                                <Text>
                                    {bus['dest_tc']}
                                </Text>
                            </View>
                            <Text>{' '}</Text>
                            方向 
                            <Text>{' '}</Text>
                            <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
                                darkColor="rgba(255,255,255,0.05)"
                                lightColor="rgba(0,0,0,0.05)">
                                <Text>
                                    { bus['count'] }
                                </Text>
                            </View>
                            <Text>{' '}</Text>
                            班次
                        </MonoText>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    homeScreenFilename: {
      marginVertical: 7,
    },
    codeHighlightContainer: {
      borderRadius: 3,
      paddingHorizontal: 4,
      fontSize: 18,
    },
  });