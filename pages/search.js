import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image'
import { Flex, Box, Text, Icon } from '@chakra-ui/react';
import { BsFilter } from 'react-icons/bs';


import Property from '../components/Property';
import SearchFilters from '../components/SearchFilters';
import noresult from '../assets/images/noresult.svg';
import { baseUrl, fetchApi } from '../utils/fetchApi';


const Search = ({ properties }) => {
    const [searchFilters, setSearchFilters] = useState(false);
    const router = useRouter();

    return (
        <Box>

            <Flex
                // if currently filtering something-- stop filtering on click (clear filter) or vice-versa
                onClick={() => setSearchFilters(!searchFilters)}
                cursor='pointer'
                bg='gray.100'
                borderBottom='1px'
                borderColor='gray.200'
                p='2'
                fontWeight='black'
                fontSize='lg'
                justifyContent='center'
                alignItems='center'
            >

                <Text>Search Property By Filters</Text>
                {/* when click on flex it will show/hide SearchFilter Component */}
                <Icon paddingLeft='2' w='7' as={BsFilter} />
            </Flex>

            {searchFilters && <SearchFilters />}

            <Text fontSize='2xl' p='4' fontWeight='bold'>
                {/* 
                * router contains the url -- if you go to 'rent' properties it will be contained in url 
                * 'purpose' is a query parameter: http://localhost:3000/search/purpose=for-sale
                */}
                Properties {router.query.purpose}
            </Text>

            <Flex flexWrap='wrap'>
                {/* map over all properties and then display 'Property' component for each */}
                {properties.map((property) => <Property property={property} key={property.id} />)}
            </Flex>

            {/* if no properties -- show error message */}
            {properties.length === 0 && (
                <Flex justifyContent='center' alignItems='center' flexDir='column' marginTop='5' marginBottom='5'>
                    <Image src={noresult} />
                    <Text fontSize='xl' marginTop='3'>No Result Found.</Text>
                </Flex>
            )}
            
        </Box>
    )
}


/**
 * import all properties
 * 'query' comes from url: http://localhost:3000/search/purpose=for-sale
 * need to use getServerSideProps instead of getStaticProps:
 * getStaticProps -- fetch data at build time aka before user visits page (static generation)
 * getServerSideProps == fetch data on each request (server-side rendering)
 * https://nextjs.org/docs/basic-features/data-fetching
 */
export async function getServerSideProps({ query }) {
    // also need to provide a default value '||'
    const purpose = query.purpose || 'for-rent';
    const rentFrequency = query.rentFrequency || 'yearly';
    const minPrice = query.minPrice || '0';
    const maxPrice = query.maxPrice || '1000000';
    const roomsMin = query.roomsMin || '0';
    const bathsMin = query.bathsMin || '0';
    const sort = query.sort || 'price-desc';
    const areaMax = query.areaMax || '35000';
    const locationExternalIDs = query.locationExternalIDs || '5002';
    const categoryExternalID = query.categoryExternalID || '4';

    const data = await fetchApi(`${baseUrl}/properties/list?locationExternalIDs=${locationExternalIDs}&purpose=${purpose}&categoryExternalID=${categoryExternalID}&bathsMin=${bathsMin}&rentFrequency=${rentFrequency}&priceMin=${minPrice}&priceMax=${maxPrice}&roomsMin=${roomsMin}&sort=${sort}&areaMax=${areaMax}`);



    return {
        props: {
            properties: data?.hits, 
        },
    };
}




export default Search
