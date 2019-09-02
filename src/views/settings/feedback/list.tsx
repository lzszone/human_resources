import React from 'react';
import styled from 'styled-components/macro';

import useTitle from "../../../hooks/use_title";
import useStaticApi from '../../../hooks/use_api';
import api from '../../../services/api';
import renderPage from '../../../components/render_page';
import Container from '../../../components/container';

export default function List() {
    useTitle('反馈记录');
    const {data, error, isLoading} = useStaticApi(api.complaint.list, {pageNum: 1, pageSize: 20});

    return renderPage(error, isLoading, data, () => <Container>
        {data.list.map(d => JSON.stringify(d))}
    </Container>)
}