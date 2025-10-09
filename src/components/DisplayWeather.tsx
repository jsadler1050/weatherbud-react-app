import React from "react";
import { MainWrapper } from "./style.module";
import { BsFillCloudRainFill, BsFillSunFill, BsCloudyFill, BsCloudFog2Fill } from 'react-icons/bs';
import { TiWeatherPartlySunny } from 'react-icons/ti';
import { AiOutlineSearch } from 'react-icons/ai';
import { WiHumidity } from 'react-icons/wi';
import { FaWind } from 'react-icons/fa';
import { RiLoaderFill } from 'react-icons/ri';
import axios from "axios";

interface WeatherDataProps{
    name:string;

    main: {
        temp:number,
        humidity:number,
    },
    sys:{
        country:string;
    },
    weather:{
        main:string;
    }[];
    wind:{
        speed:number;
    }
}
const DisplayWeather = () => {
    const api_key = "0cc86d16bf572f78cdc96c096c7627e5"; 
    const api_Endpoint = "https://api.openweathermap.org/data/2.5/";

    const [weatherData, setWeatherData] = React.useState<WeatherDataProps | null>(null);
    const [isLoading, setIsLoading] = React.useState(true)
    const [searchCity, setSearchCity] = React.useState("")

    // Use a single useEffect to handle initial data fetching.
    React.useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords; {/* Coordinates of a given city*/}
            const url = `${api_Endpoint}weather?lat=${latitude}&lon=${longitude}&appid=${api_key}&units=metric`;
            try {
                const response = await axios.get(url);
                setWeatherData(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching weather data based on geolocation:", error);
                setIsLoading(false);
            }
        });
    }, []);

    const handleSearch = async () => {
        setIsLoading(true);
        if (searchCity.trim() === "") {
            setIsLoading(false);
            return;
        }

        try {
            const url = `${api_Endpoint}weather?q=${searchCity}&appid=${api_key}&units=metric`;
            const searchResponse = await axios.get(url);
            setWeatherData(searchResponse.data);
        } catch (error) {
            console.error("No Results Found");
            setWeatherData(null);
        } finally {
            setIsLoading(false);
        }
    };
    

    const iconChanger = (weather:string) => {
        let iconElement: React.ReactNode; //icon symbols are stored into this variable
        let iconColor: string;
        
        switch(weather){
            case "Rain":
            iconElement = <BsFillCloudRainFill />
            iconColor="#272829";
            break;

            case "Clear":
            iconElement = <BsFillSunFill />
            iconColor="#FFC436";
            break;

            case "Clouds":
            iconElement = <BsCloudyFill />
            iconColor="#102C57";
            break;

            case "Mist":
            iconElement = <BsCloudFog2Fill />
            iconColor="#279EFF";
            break;

            default:
                iconElement = <TiWeatherPartlySunny />
                iconColor="#7B2869"
        }
        return (
            <span className="icon" style={{color:iconColor}}> 
            {iconElement}
            </span>
        )
    }

    return (
        <MainWrapper>
            <div className="container">
                <div className="searchArea">
                    <input type="text" placeholder="Enter a city"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                    />
                    <div className="searchCircle"> 
                        <AiOutlineSearch className='searchIcon' onClick={handleSearch}/>
                    </div>
                </div>

                {weatherData && !isLoading ? (
                    <>
                    <div className="weatherArea">
                    <h1>{weatherData.name}</h1>
                    <span>{weatherData.sys.country}</span>
                    <div className="icon">
                        {iconChanger(weatherData.weather[0].main)}
                    </div>
                    <h1>{weatherData.main.temp}°C</h1>
                    <h2>{weatherData.weather[0].main}</h2>
                </div>

                <div className="bottomInfoArea">
                    <div className="humidityLevel">
                        <WiHumidity className="windIcon"/>
                        <div className="humidInfo">
                            <h1>{weatherData.main.humidity}</h1>
                            <p>Humidity</p>
                        </div>
                    </div>

                    <div className="wind">
                        <FaWind className="windIcon"/>
                        <div className="humidInfo">
                        <h1>{weatherData.wind.speed}km/h</h1>
                        <p>wind speed</p>
                    </div>
                    </div> 
                </div>

                    </>
                ) : (
                    <div className="loading">
                        <RiLoaderFill className="loadingIcon"/>
                        <p>Loading</p>
                    </div>
                )}
            </div>
        </MainWrapper>
    );
};

export default DisplayWeather;