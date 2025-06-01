'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

const quotes = ({ quotes, handleDelete }) => {
    return (
        <div>
            {quotes.map((quote) => {
                return (
                    <article
                        className=" my-5 border-l-4 border-white pl-3 flex justify-between"
                        key={quote.id}>
                        <div>
                            <p className="text-xl font-bold">{quote.quote} </p>
                            <div className="text-lg font-italic">
                                {quote.author}
                            </div>
                        </div>
                        <div
                            className="text-white hover:text-red-500 cursor-pointer transition-all duration-300"
                            onClick={() => handleDelete(quote.id)}>
                            Delete
                        </div>
                    </article>
                );
            })}
        </div>
    );
};

export default quotes;
