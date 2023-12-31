import { useSearchParams } from "react-router-dom";
import { useGetPlacesSearchMutation } from "../redux/api/flightPlacesSearchApi";
import { useEffect, useRef } from "react";

import styles from "../styles/searchQuerySelect.module.css";
import toast from "react-hot-toast";

const SearchQuerySelect = ({
  query,
  isQueryOpen,
  setIsQueryOpen,
  search,
  inputRef,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const divRef = useRef();

  const [mutate, { error, data, isLoading }] = useGetPlacesSearchMutation({
    selectFromResult: ({ data, error, isLoading }) => ({
      data: data?.places.filter((item) => item.iataCode !== undefined),
      isLoading,
      error,
    }),
  });

  useEffect(() => {
    async function getQueryData() {
      if (!query || query?.length === 0) return;

      try {
        await mutate({ query }).unwrap();
      } catch (err) {
        console.error(err);

        if (err && err?.data?.message) {
          toast.error(err?.data?.message);
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      }
    }

    getQueryData();
  }, [query, mutate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !inputRef?.current?.contains(e.target) &&
        !divRef?.current?.contains(e.target)
      ) {
        setIsQueryOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputRef, setIsQueryOpen, divRef]);

  return (
    <>
      {isQueryOpen && !isLoading && (
        <div ref={divRef} className={styles.popUp}>
          {error && (
            <span id={styles.err}>Too many requests! try again later.</span>
          )}
          {data?.map((place, id) => (
            <div
              key={id}
              onClick={() => {
                searchParams.set(search, place.iataCode);
                setSearchParams(searchParams);
                setIsQueryOpen(false);
              }}
            >
              <p>
                {place.name.toUpperCase()} ( {place.iataCode} )
                <span>{place.countryName}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SearchQuerySelect;
