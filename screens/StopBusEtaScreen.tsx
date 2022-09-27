import { Text, View } from '../components/Themed';
import { StyleSheet, FlatList } from 'react-native';
import { useState, useEffect } from 'react';

export default function StopBusEtaScreen(route: any) {
    const {stopID, stopName} = route.route.params;
    const [data, setData] = useState([]);

    const [isFetching, setIsFetching] = useState(false);

    interface EtaBus {
        route: string;
        dest_tc:string;
        eta: string;
    }

    const estimated_bus_arrival = async (stop_id:string) => {
        try {
                const response = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop-eta/${stop_id}`);
                const json = await response.json();
                const busData = json.data;
                setData(busData)
            } catch (error) {
                console.error(error);
        }
    }

    useEffect(() => {
        estimated_bus_arrival(stopID);
    }, []);

      // flatlist item
    const renderItem = ({ item }: { item: EtaBus }) => {
        let etatime, etaDate, currentDate;
        if(item.eta!=null){
            etaDate = new Date(item.eta).getTime();
            currentDate = new Date().getTime();
            etatime = Math.round((etaDate - currentDate)/1000/60);
        }else{
            etatime = item.eta;
        }
        if(etatime < 0){
            etatime = 0;
        }

        return(
            <View style={styles.item}>
                <Text>{item.route} 往
                    <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
                                    darkColor="rgba(255,255,255,0.05)"
                                    lightColor="rgba(0,0,0,0.05)">
                        <Text>{item.dest_tc}</Text>
                    </View>
                    <Text>{' '}</Text>
                                方向 
                    <Text>{' '}</Text>
                    <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
                                    darkColor="rgba(255,255,255,0.05)"
                                    lightColor="rgba(0,0,0,0.05)">
                        <Text>{etatime!=null? etatime + '分鐘':'沒有班次'}</Text>
                    </View>
                </Text>
            </View>
        )
    }

    const onRefresh = async () => {
        setIsFetching(true);
        estimated_bus_arrival(stopID);
        setIsFetching(false);
    };
    
    return(
        <View style={styles.container}>
            <View style={styles.stopName}>
                <Text style={styles.title}>{stopName}</Text>
            </View>
            <View style={styles.busList}>
                    <FlatList
                    data={data}
                    renderItem={renderItem}
                    initialNumToRender={10}
                    keyExtractor={(item: object, index: number) => index.toString()}
                    onRefresh={onRefresh}
                    refreshing={isFetching}
                    />
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    stopName: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
    },
    busList: {
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
    homeScreenFilename: {
        marginVertical: 7,
    },
    codeHighlightContainer: {
        borderRadius: 3,
        paddingHorizontal: 4,
        fontSize: 18,
    },
})