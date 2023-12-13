
import React from 'react'
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, FlatList, ScrollView } from 'react-native'
import firestore from "@react-native-firebase/firestore"
import storage from "@react-native-firebase/storage";
import { categoriesData } from "../data"
import { myBooksData } from '../data';
import { COLORS, FONTS, SIZES, icons } from "../constants";
import { useEffect, useState } from 'react';
import { Button, Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'


const Users = firestore().collection("USER")
const Categories = firestore().collection("Categories")
const Books = firestore().collection("Books")

const initial = () => {

    const admin = {
        username: "Tainguyenlq.0123@gmail.com",
        password: "Tainguyenlq.0123",
        point: 200,
        address: "Thu Dau Mot",
        role: "user",
    }
    Users.doc(admin.username).set(admin)
        .then(() => console.log("Add new user!"))

    myBooksData.forEach(b => {
        //lỖI ĐƯỜNG DẪN PATH STORAGE FIREBASE
        const path = b.bookCover;
        console.log("Tai" + path)
        storage()
            .ref(path)
            .getDownloadURL()
            .then(url => {
                b.bookCover = url;
                Books.doc(b.id + '')
                    .set(b)
                    .then(() => console.log("Add new books!"))
            }).catch(e => console.log("The book exists"))
    })


    categoriesData.map(c => {
        Categories.doc(c.id + "").set(c)
            .then(() => console.log("Add new Categories!"))
    })
}
export default home = () => {
    const [profileData, setProfileData] = useState([])
    const [booksData, setBooksData] = useState([])
    const [categoriesData, setCategoriesData] = useState([])
    useEffect(() => {
        initial()

        Users.doc("Tainguyenlq.0123@gmail.com")
            .onSnapshot((u) => setProfileData(u.data()))

        Books.onSnapshot((lstBooks) => {
            const result = []
            lstBooks.forEach(b => result.push(b.data()))
            setBooksData(result)
        })

        Categories.get().then(lstCategories => {
            const result = []
            lstCategories.forEach(c => result.push(c.data()))
            setCategoriesData(result)
        })
    }, [])
    const renderHeader = (profile) => {
        return (
            <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: SIZES.padding, alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                    <View style={{ marginRight: SIZES.padding }}>
                        <Text style={{ ...FONTS.h3, color: COLORS.white }}>Good Morning</Text>
                        <Text style={{ ...FONTS.h2, color: COLORS.white }}>{profile.username}</Text>
                    </View>
                </View>

                <Button
                    
                    mode="contained" onPress={() => console.log('Pressed')}
                    style={{ backgroundColor: COLORS.primary }}
                >
                    {profile.point} point
                </Button>
            </View>
        )
    }

    const LineDivider = () => {
        return (
            <View style={{ width: 1, paddingVertical: 5 }}>
                <View style={{ flex: 1, borderLeftColor: COLORS.lightGray2, borderLeftWidth: 1 }}></View>
            </View>
        )
    }

    const renderButtonSection = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', padding: SIZES.padding }}>
                <View style={{ flexDirection: 'row', height: 70, backgroundColor: COLORS.secondary, borderRadius: SIZES.radius, justifyContent: 'center' }}>
                    <Button
                        mode="text"
                        icon={() => <Icon source={icons.claim_icon} size={25} />}
                        onPress={() => console.log('Pressed')}
                        style={{ justifyContent: 'center' }}
                    >
                        <Text style={{ fontSize: 15, color: COLORS.white }}> Claim </Text>
                    </Button>
                    <LineDivider />
                    <Button
                        mode="text"
                        icon={() => <Icon source={icons.point_icon} size={25} />}
                        onPress={() => console.log('Pressed')}
                        style={{ justifyContent: 'center' }}
                    >
                        <Text style={{ fontSize: 15, color: COLORS.white }}> Get Point </Text>
                    </Button>
                    <LineDivider />
                    <Button
                        mode="text"
                        icon={() => <Icon source={icons.card_icon} size={25} />}
                        onPress={() => console.log('Pressed')}
                        style={{ justifyContent: 'center' }}
                    >
                        <Text style={{ fontSize: 15, color: COLORS.white }}> My Card </Text>
                    </Button>
                </View>
            </View>
        )
    }

    const renderMyBookSection = (booksData) => {
        const navigation = useNavigation();
        const renderItem = ({ item, index }) => {

            return (
                <TouchableOpacity
                    style={{ flex: 1, marginLeft: index == 0 ? SIZES.padding : 0, marginRight: SIZES.radius }}
                    onPress={() => navigation.navigate("BookDetail", { book: item })}
                >
                    <Image
                        source={{ uri: item.bookCover }}
                        resizeMode="cover"
                        style={{ width: 180, height: 250, borderRadius: 20 }}
                    />

                    <View style={{ marginTop: SIZES.radius, flexDirection: 'row', alignItems: 'center' }}>
                        <Button
                            icon={() => <Icon source={icons.clock_icon} size={25} color={COLORS.lightGray} />}
                            textColor={COLORS.lightGray}
                        >
                            {item.lastRead}
                        </Button>
                        <Button
                            icon={() => <Icon source={icons.page_icon} size={25} color={COLORS.lightGray} />}
                            textColor={COLORS.lightGray}
                        >
                            {item.completion}
                        </Button>
                    </View>

                </TouchableOpacity>
            )
        }
        return (
            <View style={{ flex: 1 }}>
                <View style={{ paddingHorizontal: SIZES.padding, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Text style={{ ...FONTS.h2, color: COLORS.white }}> My Book </Text>
                    <Button mode="text" onPress={() => console.log("See more")}
                        labelStyle={{ color: COLORS.lightGray, textDecorationLine: "underline" }}
                    >
                        See more
                    </Button>
                </View>

                <View style={{ flex: 1, marginTop: SIZES.padding }}>
                    <FlatList
                        data={booksData}
                        renderItem={renderItem}
                        keyExtractor={item => `${item.id}`}
                        horizontal
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        )
    }

    const [selectedCategory, setSelectedCategory] = useState(1)
    const renderCategoryHeader = (categoriesData) => {
        const renderItem = ({ item }) => {
            return (
                <Button mode="text"
                    labelStyle={{
                        ...FONTS.h2, color: (selectedCategory == item.id) ? COLORS.white : COLORS.lightGray
                    }}
                    onPress={() => setSelectedCategory(item.id)}

                >
                    {item.categoryName}

                </Button>
            )

        }
        return (
            <View style={{ flex: 1, paddingLeft: SIZES.padding }}>
                <FlatList
                    data={categoriesData}
                    renderItem={renderItem}
                    keyExtractor={item => `${item.id}`}
                    horizontal
                    showsVerticalScrollIndicator={false}

                />

            </View>

        )
    }

    const renderCategoryData = (booksData) => {
        const navigation = useNavigation();
        var books = [];

        let selectedCategoryBooks = categoriesData.filter(
            a => a.id == selectedCategory,
        );
        console.log("Tai" + selectedCategory)

        if (selectedCategoryBooks.length > 0) {
            selectedCategoryBooks[0].books.forEach(id => {
                books.push(booksData.filter(b => b.id == id)[0]);
            });
        }
        const renderItem = ({ item }) => {
            console.log("Tai" + item)
            return (
                <View style={{ marginVertical: SIZES.base }}>
                    <TouchableOpacity
                        style={{ flex: 1, flexDirection: 'row' }}
                        onPress={() => navigation.navigate("BookDetail", { book: item })}
                    >
                        {/* Book Cover */}
                        <Image
                            source={{ uri: item.bookCover }}
                            resizeMode="cover"
                            style={{ width: 100, height: 150, borderRadius: 10 }}
                        />

                        <View style={{ flex: 1, marginLeft: SIZES.radius }}>
                            {/* Book name and author */}
                            <View>
                                <Text style={{ paddingRight: SIZES.padding, ...FONTS.h2, color: COLORS.white }}>{item.bookName}</Text>
                                <Text style={{ ...FONTS.h3, color: COLORS.lightGray }}>{item.author}</Text>
                            </View>

                            {/* Book Info */}
                            <View style={{ flexDirection: 'row', marginTop: SIZES.radius }}>
                                <Button
                                    icon={() => <Icon source={icons.page_filled_icon} size={25} color={COLORS.lightGray} />}
                                    textColor={COLORS.lightGray}
                                >
                                    {item.pageNo}
                                </Button>
                                <Button
                                    icon={() => <Icon source={icons.read_icon} size={25} color={COLORS.lightGray} />}
                                    textColor={COLORS.lightGray}
                                >
                                    {item.readed}
                                </Button>
                            </View>

                            {/* Genre */}
                            <View style={{ flexDirection: 'row', marginTop: SIZES.base }}>
                                {
                                    item.genre.includes("Adventure") &&
                                    <View style={{
                                        justifyContent: 'center', alignItems: 'center', padding: SIZES.base, marginRight: SIZES.base,
                                        backgroundColor: COLORS.darkGreen, height: 40, borderRadius: SIZES.radius
                                    }}>
                                        <Text style={{ ...FONTS.body3, color: COLORS.lightGreen }}> Adventure</Text>
                                    </View>
                                }
                                {
                                    item.genre.includes("Romance") &&
                                    <View style={{
                                        justifyContent: 'center', alignItems: 'center', padding: SIZES.base, marginRight: SIZES.base,
                                        backgroundColor: COLORS.darkRed, height: 40, borderRadius: SIZES.radius
                                    }}>
                                        <Text style={{ ...FONTS.body3, color: COLORS.lightRed }}> Romance </Text>
                                    </View>
                                }
                                {
                                    item.genre.includes("Drama") &&
                                    <View style={{
                                        justifyContent: 'center', alignItems: 'center', padding: SIZES.base, marginRight: SIZES.base,
                                        backgroundColor: COLORS.darkBlue, height: 40, borderRadius: SIZES.radius
                                    }}>
                                        <Text style={{ ...FONTS.body3, color: COLORS.lightBlue }}> Drama </Text>
                                    </View>
                                }
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            )

        }
        return (

            <View style={{ flex: 1, marginTop: SIZES.radius, paddingLeft: SIZES.padding, flexDirection: 'column-reverse' }}>
                <FlatList
                    data={books}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                />
            </View>

        )
    }
    return (
        <SafeAreaView style={{ ...styles.Container, backgroundColor: COLORS.black }}>
            {/* Header session */}
            <View style={{ height: 200 }}>
                {renderHeader(profileData)}
                {renderButtonSection()}
            </View>

            {/* Book section */}
            <ScrollView style={{ marginTop: SIZES.radius }}>
                {/* Books Section */}
                <View>
                    {renderMyBookSection(booksData)}
                </View>
                {/* Calegories Section */}
                <View style={{ marginTop: SIZES.padding }}>
                    <View>
                        {renderCategoryHeader(categoriesData)}

                        {renderCategoryData(booksData)}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
////  Het trang so 3 BookStoreApp2NoCopy.pdf



const styles = StyleSheet.create({
    Container: {
        flex: 1,
    }
})