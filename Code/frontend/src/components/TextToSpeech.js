import React, { useState, useEffect } from 'react';
import { Button, HStack } from '@chakra-ui/react';

const TextToSpeech = ({ text }) => {

    const [paused, setPaused] = useState(false);
    const [speech, setSpeech] = useState(null);

    

    return (
        <Button> BUTTON FOR NOW </Button>
    )
}

export default TextToSpeech;