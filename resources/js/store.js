export default {
    state: {
        lastSearch: {
            from: '',
            to: '',
        },
        basket: {
            items: []
        },
        customer: {
            first_name: '',
            last_name: '',
            street: '',
            city: '',
            country: '',
            state: '',
            zip: '',
        }
    },
    mutations: {
        setLastSearch(state, payload) {
            state.lastSearch = payload;
        },
        setCustomer(state, payload) {
            state.customer = payload;
        },
        addToBasket(state, payload) {
            state.basket.items.push(payload);
        },
        removeFromBasket(state, payload) {
            state.basket.items = state.basket.items.filter(item => item.bookable.id !== payload);
        },
        setBasket(state, payload) {
            state.basket = payload;
        }
    },
    actions: {
        /**
         * NOTE: actions are independent without mutations
         * use dispatch to call the method
         * ex.
         * this.$yourVar.dispatch('youractions', payloadOrParamValues)
         */
		setLastSearch(context, payload) {
			context.commit('setLastSearch', payload);
			localStorage.setItem('lastSearch', JSON.stringify(payload)); // save it as JSON
		},
        loadStoredState(context) {
            const lastSearch = localStorage.getItem('lastSearch');
            const basket = localStorage.getItem('basket');
            const customer = localStorage.getItem('customer');

            if (lastSearch) {
                context.commit('setLastSearch', JSON.parse(lastSearch));
            }

            if (basket) {
                context.commit('setBasket', JSON.parse(basket));
            }

            if (customer) {
                context.commit('setCustomer', JSON.parse(customer));
            }
        },
        setCustomer({commit, state}, payload) {
            commit('setCustomer', payload);
            localStorage.setItem('customer', JSON.stringify(state.customer));
        },
        addToBasket({ commit, state }, payload) { // ES6 Object deconstructing of first param ex. let {data} = axios.get().data;
            // context.state, context.commit
            commit('addToBasket', payload);
            localStorage.setItem('basket', JSON.stringify(state.basket));
        },
        /**
         removeFromBasket(context, payload)
        */
        removeFromBasket({ commit, state }, payload) {
            commit('removeFromBasket', payload);
            localStorage.setItem('basket', JSON.stringify(state.basket));
        },
        setBasket(state, payload) {
            state.basket = payload;
        },
        clearBasket({ commit, state }, payload) {
            commit("setBasket", { items: [] });
            localStorage.setItem("basket", JSON.stringify(state.basket));
        },
        clearCustomer({commit, state}, payload) {
            commit("setCustomer", {});
            localStorage.setItem("customer", JSON.stringify(state.customer));
        }
	},
    getters: {
        itemsInBasket: (state) => state.basket.items.length,
        customer: (state) => state.customer,
        inBasketAlready: (state) => (id) => {// composition
            return state.basket.items.reduce( // initial state is passed in the result
                    (result, item) => result || item.bookable.id == id, 
                    false
                );
        }
    }
}