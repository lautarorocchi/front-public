import React, {useState} from 'react'

function Pagination({ postsPerPage, totalPosts, paginate, getPrevious, getNext}) {

    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <>       
                {pageNumbers.map(number => (
                    <span key={number} className='listPaginator'>
                        <a href="#" role="button" onClick={() => paginate(number)} className="aNumber">{number}</a>
                    </span>
                ))}
        </>
    )
}

export default Pagination
