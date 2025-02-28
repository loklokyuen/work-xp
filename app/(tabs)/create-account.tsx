import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification, signInAnonymously, sendPasswordResetEmail, updatePassword, updateProfile } from 'firebase/auth';
import { auth } from '../../database/firebase';
import { Link } from 'expo-router';
import styles from '../styles';
import { router } from 'expo-router';
const CreateAccount = () => {
    const [user, setUser] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleCreateAccount =  () => {

        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential)=>{
            // const user = userCredential.user;
            // console.log(user);
            alert('Account created successfully!');
            console.log(email);
            const user = auth.currentUser;
            if (user) {
                console.log(user);
                setUser(user.email || '');
                updateProfile(user,{
                    displayName: displayName
                })
                router.replace('/(tabs)/success-sign-in');
                // sendEmailVerification(user)
                //   .then(() => {
                //     alert("Email verification sent.");
                //   })
                //   .catch((error) => {
                //     console.error("Error sending email verification:", error);
                //   });
              } else {
                console.log("User is not signed in.");
              }
            setError('');

        })
        .catch((error)=>{
            const errorCode = error.code;
            const errorMessage = error.message;
            setError(errorMessage);
        });

    };



    const handleGuestSignIn = () => {
        signInAnonymously(auth)
        .then(() => {
            setUser('Guest');
            alert('Signed in as guest!');
            setError('');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setError(errorMessage);
        });
    }



    return (
        <View style={styles.container}>
            { user ? <Text style={styles.title}>Signed in as {displayName? displayName: email}</Text> : <Text style={styles.title}>Create Account</Text>}
            <TextInput
                style={styles.input}
                placeholder="Display Name"
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.fixToText}>
                <Button title="Create Account" onPress={handleCreateAccount} />
                <Button title="Continue as guest" onPress={handleGuestSignIn} />
            </View>
            <Text>Already have an account?</Text>
            <Link href='/sign-in'>
                <Button title="Sign in" />
            </Link>
        </View>
    );
};



export default CreateAccount;