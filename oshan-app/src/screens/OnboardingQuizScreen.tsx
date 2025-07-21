import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { RootStackParamList } from '../../App'; // Adjust path if necessary
import { signInWithGoogle, signOut } from '../services/authService';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { storeQuizResults, getProfile } from '../services/backendService';

type OnboardingQuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OnboardingQuiz'>;

const questions = [
    {
        id: '1',
        question: "What's your investing style?",
        options: [
            { label: '🎯 Value Hunter', value: 'value_hunter' },
            { label: '📈 Momentum', value: 'momentum' },
            { label: '🧘 Long-Term', value: 'long_term' },
            { label: '🥳 Speculator', value: 'speculator' },
        ],
    },
    {
        id: '2',
        question: "Which sectors interest you?",
        options: [
            { label: 'Tech', value: 'tech' },
            { label: 'Green Energy', value: 'green_energy' },
            { label: 'Healthcare', value: 'healthcare' },
            { label: 'Finance', value: 'finance' },
        ],
    },
    {
        id: '3',
        question: "What values are important for your investments?",
        options: [
            { label: 'ESG (Environmental, Social, Governance)', value: 'esg' },
            { label: 'High Growth Potential', value: 'high_growth' },
            { label: 'Dividend Income', value: 'dividend_income' },
            { label: 'Ethical Practices', value: 'ethical_practices' },
        ],
    },
    {
        id: '4',
        question: "What is your risk tolerance?",
        options: [
            { label: 'Low', value: 'low_risk' },
            { label: 'Medium', value: 'medium_risk' },
            { label: 'High', value: 'high_risk' },
        ],
    },
    {
        id: '5',
        question: "How long do you typically hold investments?",
        options: [
            { label: 'Short-term (less than 1 year)', value: 'short_term' },
            { label: 'Medium-term (1-5 years)', value: 'medium_term' },
            { label: 'Long-term (5+ years)', value: 'long_term_hold' },
        ],
    },
];

const OnboardingQuizScreen = () => {
    const navigation = useNavigation<OnboardingQuizScreenNavigationProp>();
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState<any>({});
    const [quizCompleted, setQuizCompleted] = useState(false);

    function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
        setUser(user);
        if (initializing) {
            setInitializing(false);
        }
    }

    useEffect(() => {
        if (!initializing && user) {
            const checkUserProfile = async () => {
                try {
                const profile = await getProfile(user.uid); // Pass userId to getProfile
                    if (profile) {
                     setQuizCompleted(true);
                        navigation.navigate('MainTabs');
                    } else {
                     setQuizCompleted(false);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    // If profile doesn't exist or error, assume quiz needs to be shown
                    setQuizCompleted(false);
                }
            };
            checkUserProfile();
        } else if (!initializing && !user) {
            setQuizCompleted(false); // Not authenticated, show sign-in
        }
    }, [user, initializing, navigation]);

    const handleGoogleSignIn = async () => {
        try {
            const userCredential = await signInWithGoogle();
            if (userCredential) {
                // On successful sign-in, the useEffect for 'user' will handle navigation/quiz show
            }
        } catch (error) {
            console.error("Google sign-in failed", error);
            Alert.alert("Sign In Error", "Failed to sign in with Google. Please try again.");
        }
    };

    const handleAnswer = (questionKey: string, answer: string) => {
        setQuizAnswers((prevAnswers: any) => ({
            ...prevAnswers,
            [questionKey]: answer,
        }));
    };

    const handleNext = async () => {
        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) {
            // This should ideally not happen if quiz flow is correct, but adding defensive check
            Alert.alert("Error", "Could not determine current question. Please restart the quiz.");
            return;
        }

        let questionKey = '';
        switch (currentQuestionIndex) {
            case 0: questionKey = 'investingStyle'; break;
            case 1: questionKey = 'sectors'; break;
            case 2: questionKey = 'values'; break;
            case 3: questionKey = 'riskTolerance'; break;
            case 4: questionKey = 'experience'; break;
            default: questionKey = `question${currentQuestion.id}`;
        }

        const currentAnswer = quizAnswers[questionKey];

        if (!currentAnswer) {
            Alert.alert("Please select an answer", "You must choose an option to proceed.");
            return;
        }


        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Quiz completed
            Alert.alert("Quiz Completed", "Thank you for completing the quiz!");
            try {
                if (user) {
                    const payload = {
                        userId: user.uid,
                        investingStyle: quizAnswers.investingStyle,
                        sectors: quizAnswers.sectors ? [quizAnswers.sectors]: [],
                        values: quizAnswers.values ? [quizAnswers.values]: [],
                        riskTolerance: quizAnswers.riskTolerance,
                        experience: quizAnswers.experience,
                    };
                    await storeQuizResults(payload);
                    console.log("Quiz answers saved to MongoDB via backend service.");
                    setQuizCompleted(true);
                } else {
                    console.warn("User not signed in, cannot save quiz answers.");
                }
            } catch (error) {
                console.error("Error saving quiz answers to MongoDB:", error);
                Alert.alert("Save Error", "Failed to save quiz answers. Please try again.");
            }
            navigation.navigate('MainTabs');
        }
    };

    const renderQuestion = () => {
        const q = questions[currentQuestionIndex];
        if (!q) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Quiz Completed or Error</Text>
                    <Button title="Go to Home" onPress={() => navigation.navigate('MainTabs')} />
                </View>
            );
        }

        let questionKey = '';
        switch (currentQuestionIndex) {
            case 0: questionKey = 'investingStyle'; break;
            case 1: questionKey = 'sectors'; break;
            case 2: questionKey = 'values'; break;
            case 3: questionKey = 'riskTolerance'; break;
            case 4: questionKey = 'experience'; break;
            default: questionKey = `question${q.id}`;
        }

        return (
            <View style={styles.quizContent}>
                <Text style={styles.questionText}>{q.question}</Text>
                {q.options.map((option) => (
                    <Button
                        key={option.value}
                        title={option.label}
                        onPress={() => handleAnswer(questionKey, option.value)}
                        color={quizAnswers[questionKey] === option.value ? '#2563eb' : '#6b7280'}
                    />
                ))}
            </View>
        );
    };

    if (initializing) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.title}>Loading...</Text>
            </View>
        );
    }


    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Welcome to Oshan!</Text>
                <Text style={styles.subtitle}>Sign in to discover stocks that match your beliefs & style.</Text>
                <GoogleSigninButton
                    style={styles.googleButton}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={handleGoogleSignIn}
                />
            </View>
        );
    }

    if (quizCompleted) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Your profile is loaded. Enjoy Oshan!</Text>
                <Button title="Go to Home" onPress={() => navigation.navigate('MainTabs')} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {renderQuestion()}
            <Button title="Next" onPress={handleNext} />
            {currentQuestionIndex > 0 && (
                <Button title="Back" onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f4f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2d3748',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#4a5568',
    },
    googleButton: {
        width: 192,
        height: 48,
    },
    quizContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    questionText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#2d3748',
    },
});

export default OnboardingQuizScreen;