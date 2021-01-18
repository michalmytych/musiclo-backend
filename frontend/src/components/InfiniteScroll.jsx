import React, { useEffect, useState, useRef  } from 'react';


const InfiniteScroll = () => {
    const [itemList, setItemsList] = useState({
        list: [1,2,3,4]
    }); 

    const [page, setPage] = useState(1);
    const loader = useRef(null);

    useEffect(() => {
        var options = {
            root: null,
            rootMargin: "20px",
            threshold: 1.0
        };
        const observer = new IntersectionObserver(handleObserver, options);
        if (loader.current) {
            observer.observe(loader.current)
        }

    }, []);


    useEffect(() => {
        // here we simulate adding new posts to List
        const newList = itemsList.list.concat([1,1,1,1]);
        setItemsList({
            list: newList
        })
    }, [page])

    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting) {   
            setPage((page) => page + 1)
        }
    }

    return (
        <div>
            {
                itemsList.list.map((item, index) => {
                    return (<div key={index}>
                        <h2> {item} </h2>
                    </div>)
                })
            }
            <div className="loading" ref={loader}>
                <h2>Load More</h2>
            </div>
        </div>
    )
}

export default InfiniteScroll;