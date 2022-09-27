import { StyleSheet, TextInput, View } from 'react-native';

export default function SearchBar({handleSearch}:{handleSearch:(queryText: string)=>void}) {
    return(
        <View style={styles.searchBar}>
            <TextInput 
            style={styles.textInput}
            placeholder={"搜索"}
            onChangeText={(queryText: string) => handleSearch(queryText)}
            autoCapitalize = {"characters"}
            />
      </View>
    )
}

const styles = StyleSheet.create({
    textInput: {
      borderWidth: 1,
      borderColor: '#000000',
      borderRadius: 8,
      width: '90%',
      padding: 10,
      marginVertical: 20,
      backgroundColor: '#ffffff'
    },
    searchBar: {
      alignItems: 'center',
      justifyContent: 'center',
    }
  });