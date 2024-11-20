'use client';
import { Dropdown, Form, InputGroup, ListGroup } from 'react-bootstrap';
import styles from './page.module.css';
import httpService from '../axiosConfig';
import { useEffect, useRef, useState } from 'react';
import { HTTPPaginatedResponse } from '../shared/models/httpresponse';
import { Movie } from '../shared/models/movie';

export default function MoviesList() {
    const [moviesList, setMoviesList] = useState<Movie[]>([]);
    const allMovies = useRef<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie>();

    useEffect(() => {
        httpService.get('/films/?format=json').then((res: HTTPPaginatedResponse<Movie>) => {
            allMovies.current = res.data.results;
            setMoviesList(res.data.results);
        })
    }, [])

    const onMovieSelect = (e: any, data: Movie) => {
        setSelectedMovie(data);
    }
    const onSearch = (value: string) => {
        const filteredData = allMovies.current.filter(x => x.title.toLowerCase().indexOf(value) != -1);
        setMoviesList(filteredData);
    }
    const onSort = (e: any, sortKey: string) => {
        switch (sortKey) {
            case "episode":
                allMovies.current = [...allMovies.current].sort((a, b) => {
                    if (a.episode_id < b.episode_id) return -1;
                    if (a.episode_id > b.episode_id) return 1;
                    return 0;
                })
                break;
            case "year":
                allMovies.current = [...allMovies.current].sort((a, b) => {
                    if (new Date(a.created).getTime() < new Date(b.created).getTime()) return -1;
                    if (new Date(a.created).getTime() > new Date(b.created).getTime()) return 1;
                    return 0;
                })
                break;
        }
        setMoviesList(allMovies.current);
    }
    return (
        <div className={styles.movies_container}>
            <div className={styles.header_section}>
                <Dropdown className='me-2'>
                    <Dropdown.Toggle variant='secondary' id="dropdown-basic">
                        Sort by...
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={(e) => onSort(e, 'episode')}>Episode</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => onSort(e, 'year')}>Year</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <InputGroup>
                    <InputGroup.Text id="basic-addon1">
                        <i className="bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                        placeholder="Search"
                        aria-label="Search"
                        aria-describedby="basic-addon1"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </InputGroup>
            </div>
            <div className={styles.left_section}>
                <ListGroup className={styles.movies_list} variant='flush'>
                    {
                        moviesList.map((ele, index) => {
                            return (
                                <ListGroup.Item className={styles.movie_item} key={index} action onClick={(e) => onMovieSelect(e, ele)}>
                                    <div className={styles.movie_id}>
                                        Episode {ele.episode_id}
                                    </div>
                                    <div className={styles.movie_title}>
                                        {ele.title}
                                    </div>
                                    <div className={styles.movie_date}>
                                        {new Date(ele.created).toDateString()}
                                    </div>
                                </ListGroup.Item>
                            )
                        })
                    }
                </ListGroup>
            </div>
            <div className={styles.right_section}>
                {
                    selectedMovie ?
                        <div className={styles.movie_details}>
                            <h2>{selectedMovie.title}</h2>
                            <p className='mb-2'>{selectedMovie.opening_crawl}</p>
                            <p>Directed by: {selectedMovie.director}</p>
                        </div> :
                        <p className='text-center'>No movie selected.</p>
                }
            </div>
        </div>
    )
}  