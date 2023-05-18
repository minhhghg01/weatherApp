import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import Weather from "../../components/WeatherCurrent";
import { API_KEY } from "../../constants";
import { getCurrentData } from "../../api/weatherAPI";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Info = ({ route }) => {
  const { location } = route.params;
  const [weatherData, setWeatherData] = useState(null);
  const navigator = useNavigation();
  const [loaded, setLoaded] = useState(true);

  const fetchWeatherData = async () => {
    setLoaded(false);
    const response = await getCurrentData(location);
    if (response) {
      setWeatherData(response);
    }
    setLoaded(true);
  };
  const url = `http://api.openweathermap.org/data/2.5/onecall?units=metric&eclude=minutely&appid=${API_KEY}`;
  const [forecast, setForecast] = useState(null);

  const loadForecast = async () => {
    const response1 = await getCurrentData(location);

    const response = await fetch(
      `${url}&lat=${response1.coord.lat}&lon=${response1.coord.lon}`
    );
    const data = await response.json();
    if (!response.ok) {
      Alert.alert("Error", data.message);
    } else {
      setForecast(data);
    }
  };

  useEffect(() => {
    loadForecast();
    fetchWeatherData();
    console.log(location);
    console.log("Location");
  }, []);

  if (!loaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <ActivityIndicator color="gray" size={36} />
      </View>
    );
  } else if (weatherData === null) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Text>City Not Found! Try Different City</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}>
      <View
        style={{
          flex: 0.1,
          flexDirection: "row",
          margin: 10,
          position: "absolute",
          left: 20,
          top: 80,
          zIndex: 1,
        }}>
        <Icon
          style={{ fontSize: 28, margin: 10 }}
          name="arrow-left"
          type="font-awesome"
          onPress={() => {
            navigator.goBack();
          }}
        />
      </View>
      <View
        style={{
          flex: 0.1,
          flexDirection: "row",
          margin: 10,
          position: "absolute",
          right: 20,
          top: 80,
          zIndex: 1,
        }}>
        <Icon
          style={{ fontSize: 28, margin: 10 }}
          name="heart"
          type="font-awesome"
          onPress={() => {
            AsyncStorage.getItem("location").then((locations) => {
              const newLocations = JSON.parse(locations) || [];
              if (newLocations.includes(location)) {
                return;
              }
              newLocations.push(location);
              AsyncStorage.setItem(
                "location",
                JSON.stringify(newLocations)
              ).then(() => {
                navigator.navigate("Main");
              });
            });
          }}
        />
      </View>
      <Weather
        weatherData={weatherData}
        setWeatherData={setWeatherData}
        forecast={forecast}
      />
      <View
        style={{
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
          top: 30,
          right: 10,
          zIndex: 100,
        }}></View>
    </View>
  );
};

export default Info;
