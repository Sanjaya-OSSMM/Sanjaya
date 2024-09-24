import React, { useState } from 'react';
import axios from 'axios';

function InputForm({ onAnalysis }) {
    const [platform, setPlatform] = useState('');
    const [keyword, setKeyword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/monitor', { platform, keyword });
            onAnalysis(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option value="">Select Platform</option>
                <option value="twitter">Twitter</option>
                <option value="instagram">Instagram</option>
            </select>
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter keyword"
            />
            <button type="submit">Monitor</button>
        </form>
    );
}

export default InputForm;