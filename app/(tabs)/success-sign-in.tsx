import styles from '../styles';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signInAnonymously, sendPasswordResetEmail, updatePassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '@/database/firebase';

const SuccessSignIn = () => {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);

    const handleChangePassword = () => {
        const user = auth.currentUser;
        if (user) {
            updatePassword(user, password)
            .then(() => {
                alert('Password changed successfully!');
                setError('');
                setShowChangePassword(false);
            }
            ).catch((error) => {
                setError(error.message);
            }
            );
        }
    }
        
    const handleSignOut = () => {
        auth.signOut().then(() => {
            alert('Signed out successfully!');
            setUser('');
            setError('');
            }
        ).catch(() => {
            // setError(error.message);
        }
        );
    }

    
    return <View style={styles.container}>
        <Text style={styles.title}>Successfully Signed In as {displayName}</Text>
        <View>
            {showChangePassword && <View>
                <TextInput
                    style={styles.input}
                    placeholder="New password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Button title="Change password" onPress={handleChangePassword} />
            </View>}

            <Button title="Sign out" onPress={handleSignOut} />
            <Text style={styles.option} onPress={()=>{setShowChangePassword(true)}}>Change password</Text>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
}

export default SuccessSignIn;