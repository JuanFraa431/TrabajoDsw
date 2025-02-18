import React from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";


//components
import Header from './components/Header';
import Footer from './components/Footer';
import Body from './components/Body';
import CardList from './components/Card';
import PreFooter from './components/PreFooter';
import CardDetail from './components/CardDetail';
import Paquetes from './components/Paquete';
import Excursiones from './components/Excursion';
import Filtro from './components/Filtro';
import VistaAdmin from './components/VistaAdmin';
import Login from './components/Login';
import DetalleCliente from './components/Cliente/DetalleCliente';
import CardDetailExcursion from './components/CardDetailExcursion';
import Register from './components/Register';

const pageTransition = {
    initial: { opacity: 0 }, 
    animate: { opacity: 1 },
    exit: { opacity: 0 }, 
    transition: { duration: 0.4 } 
};

const App: React.FC = () => {
    const location = useLocation();

    return (
        <>
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route
                        path="/"
                        element={
                            <div>
                                <Header/>
                                <motion.div {...pageTransition}>
                                    <Body/>
                                    <CardList/>
                                    <PreFooter/>
                                    <Footer/>
                                </motion.div>
                            </div>
                        }
                        
                    />
                    <Route
                        path="/cardDetail"
                        element={
                            <motion.div {...pageTransition}>
                                <Header/>
                                <CardDetail/>
                            </motion.div>
                        }
                    />
                    <Route
                        path="/cardDetailExcursion"
                        element={
                            <div>
                                <Header/>
                                <motion.div {...pageTransition}>
                                    <CardDetailExcursion/>
                                </motion.div>
                            </div>
                        }
                    />
                    <Route
                        path="/prefooter"
                        element={
                            <motion.div {...pageTransition}>
                                <PreFooter />
                            </motion.div>
                        }
                    />
                    <Route
                        path="/footer"
                        element={
                            <motion.div {...pageTransition}>
                                <Footer />
                            </motion.div>
                        }
                    />
                    <Route path="/hoteles" element={
                        <div>
                            <Header/>
                        </div>
                        } />
                    <Route path="/paquetes" element={
                        <div>
                            <Header/>
                            <motion.div {...pageTransition}>
                                <Filtro/>
                                <Paquetes/>
                            </motion.div>
                        </div>
                        } />
                    <Route path="/excursiones" element={
                        <div>
                            <Header/>
                            <motion.div {...pageTransition}>
                                <Excursiones/>
                            </motion.div>
                        </div>
                        } />
                    <Route path="/transportes" element={
                        <div>
                            <Header/>
                        </div>
                        } />
                    <Route path="/nosotros" element={
                        <div>
                            <Header/>
                        </div>
                        } />
                    <Route path='/vistaAdmin' element = {
                        <div>
                            <Header/>
                            <motion.div {...pageTransition}>
                                <VistaAdmin/>
                            </motion.div>   
                        </div>
                        
                    }/>
                    <Route path = '/login' element = {
                        <motion.div {...pageTransition}>
                            <Login/>
                        </motion.div>
                    }/>
                    <Route path = '/detalleCliente' element = {
                        <div>
                            <Header/>
                            <motion.div {...pageTransition}>
                                <DetalleCliente/>
                            </motion.div>
                        </div>
                    }/>
                    <Route
                        path="/register"
                        element={
                            <div>
                                <Header/>
                                <motion.div {...pageTransition}>
                                    <Register/>
                                </motion.div>
                            </div>
                        }
                        
                    />
                </Routes>
            </AnimatePresence>
        </>
    );
};

export default App;