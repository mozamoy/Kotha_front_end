import React,{Component} from "react";
import {View,Text,TextInput,StyleSheet,Picker,ScrollView,FlatList,Alert} from "react-native";
import {Button} from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";

export default class Send_message extends Component{

    constructor(props)
    {
        super(props);

        this.state={
            receiver:"",
            message:"",
        };
        receiver="";
        message="";
        this.send_button = this.send_button.bind(this);

    }
    componentDidMount()
    {
        receiver="";
        message="";
    }
    send_button()
    {
        try {
            if (this.message.length == 0 || this.receiver.length == 0) {
                Alert.alert(
                    'Ops!',
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
            else {
                fetch('http://5445b8f5.ngrok.io/send_message/', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sender: "taohid",
                        receiver: this.receiver,
                        message: this.message,
                    }),
                }).then((response) =>
                    response.json())
                    .then((responseJson) => {
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
                            this.setState({message:"",receiver:""});
                            this.message="";
                            this.receiver="";
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

                        <View style={{ flex: 1, paddingTop: 15, paddingLeft: 10 }}>
                            <Text>Receiver : </Text>
                        </View>

                        <View style={{ flex: 3 }}>
                            <TextInput placeholder="Enter Username" value={this.state.receiver}
                                       onChangeText={(receiver) => { this.setState({ receiver:receiver }); this.receiver=receiver; }}
                            />
                        </View>

                    </View>
                    <TextInput placeholder="Enter Your Message Here" value={this.state.message} key={"key"} onChangeText={(message) => {
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