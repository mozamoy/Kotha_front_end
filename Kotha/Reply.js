import React,{Component} from "react";
import {View, Text, TextInput, StyleSheet, Picker, ScrollView, FlatList, Alert, AsyncStorage} from "react-native";
import {Button} from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";

export default class Reply extends Component{

    constructor(props)
    {
        super(props);

        this.state={
            receiver:"",
            message:"",
            spinner_visible:false,
            sender:"",
        };
        receiver="";
        message="";
        this.send_button = this.send_button.bind(this);
        this._retrieveData = this._retrieveData.bind(this);

    }

    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('username');
            if (value !== null) {
                this.sender =value;
            }
            else{
                this.props.navigation.navigate("Sign_up");
            }
        } catch (error) {
            this.props.navigation.navigate("Sign_up");
            // Error retrieving data
        }
    }

    componentDidMount()
    {
        receiver="";
        message="";
        this._retrieveData();
    }
    send_button()
    {

        try {
            if (this.message.length == 0 ) {
                Alert.alert(
                    'Ops!',
                    "Please fill up all the fields correctly. Only English letters are supported.",
                    [

                        {
                            text: 'OK', onPress: () => {
                            }
                        },
                    ],
                    {cancelable: true}
                )
            }
            else {

                this.setState({spinner_visible:true});
                fetch('http://taohidulislam.pythonanywhere.com/reply/', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sender:this.sender,
                        receiver_id :this.props.navigation.state.params.user_id,
                        message: this.message,
                    }),
                }).then((response) =>
                    response.json())
                    .then((responseJson) => {
                        this.setState({spinner_visible:false});
                        response_text = responseJson.response_text;
                        if (response_text == "error") {
                            Alert.alert(
                                'Successful!',
                                "Please fill up all the fields correctly",
                                [

                                    {
                                        text: 'OK', onPress: () => {
                                        }
                                    },
                                ],
                                {cancelable: true}
                            )

                        }
                        else if (response_text == "block") {
                            Alert.alert(
                                'Ops!',
                                'Sorry, you cannot send message to this user.',
                                [

                                    {
                                        text: 'OK', onPress: () => {
                                        }
                                    },
                                ],
                                {cancelable: true}
                            )
                        }
                        else if (response_text == "no receiver") {
                            Alert.alert(
                                'Ops!',
                                'No receiver found with this username',
                                [

                                    {
                                        text: 'OK', onPress: () => {
                                        }
                                    },
                                ],
                                {cancelable: true}
                            )
                        }
                        else if (response_text == "successful") {
                            Alert.alert(
                                'Successful!',
                                'Successfully your message sent',
                                [

                                    {
                                        text: 'OK', onPress: () => {
                                        }
                                    },
                                ],
                                {cancelable: true}
                            );

                            this.props.navigation.navigate("All_messages");
                        }
                    });
            }
        }
        catch (e) {
            Alert.alert(
                'Successful!',
                "Please fill up all the fields correctly",
                [

                    {
                        text: 'OK', onPress: () => {
                        }
                    },
                ],
                {cancelable: true}
            )
        }
    }
    render()
    {
        return(
            <View>

                <ScrollView>
                    <Spinner visible={this.state.spinner_visible} textContent={"Loading..."} textStyle={{ color: '#FFF' }} cancelable={true} />
                    <View style={{ flexDirection: "row" ,paddingTop:20,paddingBottom:20}}>

                        <View style={{ flex: 1, paddingTop: 15,paddingBottom:20, paddingLeft: 10 }}>
                            <Text>{this.props.navigation.state.params.message}</Text>
                        </View>


                    </View>
                    <TextInput placeholder="Enter Your Reply Here" value={this.state.message} key={"key"} onChangeText={(message) => {
                        this.message = message;
                        this.setState({ message: message })
                    }} multiline={true} />

                    <View style={{ alignItems: "center", justifyContent: "center" ,paddingBottom: 20 }}>
                        <Button titleStyle={{ fontWeight: "1000", }} buttonStyle={{
                            paddingTop: this.padding,
                            borderRadius: 5, width: 200, height: 45, backgroundColor: "rgb(8, 71, 98)", paddingTop: 5,
                            minHeight:40
                        }} onPress={()=>this.send_button()} title="SEND"  />
                    </View>

                </ScrollView>

            </View>
        )
    }
}