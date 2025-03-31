import React, { useState, useEffect } from 'react';
import { ChakraProvider, Button } from '@chakra-ui/react';

const TextToSpeech = ({ text }) => {

    // Create states for TTS
    const [paused, setPaused] = useState(true);
    const [speech, setSpeech] = useState(null);

    // Clean out periods for TTS as it says "dot" instead of pausing
    const cleanText = text.replace(/\./g, ", ");

    useEffect(() => {
        const synth = window.speechSynthesis;
        const speechText = new SpeechSynthesisUtterance(cleanText);

        setSpeech(speechText);

        return () => {
            synth.cancel();
        };
    }, [cleanText]);

    // Handles playing TTS
    const handlePlay = () => {
        const synth = window.speechSynthesis;

        if (paused) {
            synth.resume();
        }

        synth.speak(speech);

        setPaused(false);
    };

    // Handles pausing TTS
    const handlePause = () => {
        const synth = window.speechSynthesis;

        synth.pause();

        setPaused(true);
    };

    // Button click function
    const handleClick = () => {
        if (paused) {
            handlePlay();
            setPaused(false);
        } else {
            handlePause();
            setPaused(true);
        }
    }

    return (
        <ChakraProvider>
            <Button colorScheme="teal" variant="solid" onClick={ handleClick }> {paused ? "Play" : "Pause"} </Button>
        </ChakraProvider>
    )
}

export default TextToSpeech;