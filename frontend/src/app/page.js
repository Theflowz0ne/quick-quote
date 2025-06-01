'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Quotes from './components/Quotes';
import axios from 'axios';

export default function Home() {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const isServerError = (error) => {
        return (
            error.code === 'ECONNREFUSED' ||
            error.code === 'NETWORK_ERROR' ||
            error.message.includes('Network Error') ||
            error.message.includes('ERR_NETWORK') ||
            !error.response
        );
    };

    async function getUser() {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(
                'http://localhost:8000/api/quotes',
            );
            setQuotes(response.data);
        } catch (error) {
            console.error('Error fetching quotes:', error);
            if (isServerError(error)) {
                setError(
                    'Server is not available. Please make sure the backend server is running on http://localhost:8000',
                );
            } else {
                setError('Failed to fetch quotes. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const quote = e.target.quote.value;
        const author = e.target.author.value;

        try {
            const response = await axios.post(
                'http://localhost:8000/api/quotes',
                {
                    quote,
                    author,
                },
            );
            console.log(response);
            e.target.quote.value = '';
            e.target.author.value = '';
            await getUser(); // Refresh the quotes list
        } catch (error) {
            console.error('Error submitting quote:', error);
            if (isServerError(error)) {
                setError(
                    'Server is not available. Please make sure the backend server is running on http://localhost:8000',
                );
            } else if (error.response?.status === 422) {
                setError('Validation error. Please check your input.');
            } else {
                setError('Failed to add quote. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const quote = quotes.find((quote) => quote.id === id);
        const confirm = window.confirm(
            `Are you sure that you want to delete the quote: ${quote.quote} with author: ${quote.author}`,
        );
        if (confirm) {
            try {
                setError(null);
                const response = await axios.post(
                    `http://localhost:8000/api/quotes/${id}`,
                );
                console.log(response);
                await getUser(); // Refresh the quotes list
            } catch (error) {
                console.error('Error deleting quote:', error);
                if (isServerError(error)) {
                    setError(
                        'Server is not available. Please make sure the backend server is running on http://localhost:8000',
                    );
                } else {
                    setError('Failed to delete quote. Please try again.');
                }
            }
        }
    };

    return (
        <div className="py-20">
            {error && (
                <div className="max-w-xl mx-auto mb-6 bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-md">
                    <div className="flex items-center">
                        <svg
                            className="w-5 h-5 mr-2 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div>
                            <p className="font-medium">Server Error</p>
                            <p className="text-sm">{error}</p>
                            <button
                                onClick={() => {
                                    setError(null);
                                    getUser();
                                }}
                                className="mt-2 text-sm underline hover:no-underline">
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-xl mx-auto bg-white/10 p-4 rounded-md">
                <h1 className="text-2xl font-bold text-left mb-5">
                    Add a Quote
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-2">
                    <input
                        className="bg-white/10 p-2 rounded-md disabled:opacity-50"
                        name="quote"
                        type="text"
                        placeholder="Quote"
                        disabled={submitting}
                        required
                    />
                    <input
                        className="bg-white/10 p-2 rounded-md disabled:opacity-50"
                        name="author"
                        type="text"
                        placeholder="Author"
                        disabled={submitting}
                        required
                    />
                    <button
                        className="self-end bg-white/10 px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={submitting}>
                        {submitting ? 'Adding...' : 'Add Quote'}
                    </button>
                </form>
            </div>

            <div className="max-w-xl mx-auto mt-10">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <p className="mt-2 text-white/70">Loading quotes...</p>
                    </div>
                ) : quotes.length > 0 ? (
                    <Quotes
                        handleDelete={handleDelete}
                        quotes={quotes}
                    />
                ) : !error ? (
                    <div className="text-center py-8 text-white/70">
                        No quotes available. Add your first quote above!
                    </div>
                ) : null}
            </div>
        </div>
    );
}
