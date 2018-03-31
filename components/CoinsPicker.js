import { Component } from 'react'
import Router from 'next/router'
import axios from 'axios'
import fuzzy from '../utils/fuzzy'
import API from '../utils/APIService'

export default class CoinsPicker extends Component {
  state = {
    coins: null,
    inputCoin: '',
    fetchingCoins: true,
    focused: false
  }

  componentDidMount () {
    const coins = localStorage.getItem('coins')

    if (coins) {
      this.setState({
        coins: JSON.parse(coins),
        fetchingCoins: false
      })

      // Still update and set the cache
      API.getAllLists()
        .then(res => {
          const coins = res.data.all_lists
          localStorage.setItem('coins', JSON.stringify(coins))
          console.log('Coins list is updated.')
        })
    } else {
      API.getAllLists()
        .then(res => {
          const coins = res.data.all_lists
          localStorage.setItem('coins', JSON.stringify(coins))
          this.setState({
            coins,
            fetchingCoins: false
          })
        })
    }
  }

  changeText = (e) => {
    this.setState({ inputCoin: e.target.value })
  }

  selectCoin = (symbol) => {
    Router.push(`/coin?symbol=${symbol}`)
    this.setState({ focused: false })
  }

  renderCoins = () => {
    if (this.state.inputCoin && this.state.focused) {
      return this.state.coins
        .filter(coin => {
          const name = coin.name.toLowerCase()
          const symbol = coin.symbol.toLowerCase()
          const inputCoin = this.state.inputCoin.toLowerCase()

          return fuzzy(inputCoin, `${name} ${symbol}`)
        })
        .map(coin => (
          <li
            className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
            onClick={() => this.selectCoin(coin.symbol)}
            key={coin.cmc_id}
            style={{ cursor: 'pointer' }}
          >
            {coin.name}
            <span
              className="badge badge-primary badge-pill">{coin.symbol}
            </span>
            <style jsx>{`
              .badge {
                margin-left: 10px;
              }
            `}</style>
          </li>
        ))
    }
  }

  render () {
    if (this.state.fetchingCoins) {
      return 'Fetching those coins..'
    }

    return (
      <div>
        <div className='input-group'>
          <div className='input-group-prepend'>
            <div className='input-group-text'>🔎</div>
          </div>
          <input
            type='text' className='form-control'
            placeholder="Search coin"
            value={this.state.inputCoin}
            onChange={this.changeText}
            onFocus={() => this.setState({ focused: true })}
          />
        </div>

        <ul className='list-group'>
          {this.renderCoins()}
        </ul>

        <style jsx>{`
          .list-group {
            min-width: 250px;
            position: absolute;
            z-index: 999;
          }
          .list-group-item {
            cursor: pointer !important;
            width: 100%;
          }
        `}</style>
      </div>
    )
  }
}
