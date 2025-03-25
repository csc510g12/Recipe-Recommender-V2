import React, { useState, useEffect } from 'react';
import { ChakraProvider, Button } from '@chakra-ui/react';

const TextToSpeech = ({ text }) => {

    const [paused, setPaused] = useState(false);
    const [speech, setSpeech] = useState(null);

    useEffect(() => {
        const synth = window.speechSynthesis;
        const speechText = new SpeechSynthesisUtterance(text);

        setSpeech(speechText);

        return () => {
            synth.cancel();
        };
    }, [text]);

    const handlePlay = () => {
        const synth = window.speechSynthesis;

        if (paused) {
            synth.resume();
        }

        synth.speak(speech);

        setPaused(false);
    };

    const handlePause = () => {
        const synth = window.speechSynthesis;

        synth.pause();

        setPaused(true);
    };

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
            <Button colorScheme="teal" variant="solid" onClick={ handleClick }> {paused ? "Pause" : "Play"} </Button>
        </ChakraProvider>
    )
}

export default TextToSpeech;