import React, { useState, useEffect } from 'react';
import { Button, HStack } from '@chakra-ui/react';

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

    return (
        <Button colorPalette="green" variant="solid" onClick={ handlePlay }> BUTTON FOR NOW </Button>
    )
}

export default TextToSpeech;