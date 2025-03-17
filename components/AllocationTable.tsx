import React, { ReactNode } from "react";

interface HeaderCellProps {
  children: ReactNode;
}

const HeaderCell = ({ children }: HeaderCellProps) => (
  <th className="py-2 px-3 bg-gray-100 font-semibold border border-gray-300 dark:bg-gray-700 dark:border-gray-600 whitespace-nowrap">
    {children}
  </th>
);

interface CellProps {
  children: ReactNode;
}

const Cell = ({ children }: CellProps) => (
  <td className="py-2 px-3 border border-gray-300 dark:border-gray-600 whitespace-nowrap">
    {children}
  </td>
);

interface RowProps {
  children: ReactNode;
  isEven: boolean;
}

const Row = ({ children, isEven }: RowProps) => (
  <tr
    className={`border-b ${
      isEven ? "bg-gray-100 dark:bg-gray-700" : "dark:bg-gray-800"
    }`}
  >
    {children}
  </tr>
);

interface SubtotalRowProps {
  children: ReactNode;
}

const SubtotalRow = ({ children }: SubtotalRowProps) => (
  <tr className="bg-blue-100 font-semibold dark:bg-blue-900 dark:text-blue-300">
    {children}
  </tr>
);

interface TotalRowProps {
  children: ReactNode;
}

const TotalRow = ({ children }: TotalRowProps) => (
  <tr className="bg-green-100 font-semibold dark:bg-green-900 dark:text-green-300">
    {children}
  </tr>
);

export default function AllocationTable() {
  return (
    <div className="overflow-x-auto m-5">
      <table className="w-full border-collapse text-left text-sm text-gray-800 dark:text-gray-300">
        <thead>
          <TotalRow>
            <HeaderCell>Allocation Category</HeaderCell>
            <HeaderCell>Entity Name</HeaderCell>
            <HeaderCell>Allocated Share (%)</HeaderCell>
            <HeaderCell>Vesting Plan</HeaderCell>
            <HeaderCell>Cliff (Months)</HeaderCell>
            <HeaderCell>Vesting Period (Months)</HeaderCell>
            <HeaderCell>Immediate Liquidity (%)</HeaderCell>
            <HeaderCell>Initial Liquid Tokens</HeaderCell>
            <HeaderCell>Cliff-Release Tokens</HeaderCell>
            <HeaderCell>Monthly Vesting Rate</HeaderCell>
            <HeaderCell>Total Tokens Allocated</HeaderCell>
          </TotalRow>
        </thead>
        <tbody>
          <Row isEven={false}>
            <Cell>Contributors</Cell>
            <Cell>Webb Technologies (Developer)</Cell>
            <Cell>28.56500%</Cell>
            <Cell>A-Vesting</Cell>
            <Cell>12</Cell>
            <Cell>48</Cell>
            <Cell>0%</Cell>
            <Cell>0.00</Cell>
            <Cell>7,141,250.00</Cell>
            <Cell>595,104.17</Cell>
            <Cell>28,565,000.00</Cell>
          </Row>
          <Row isEven={true}>
            <Cell>Contributors</Cell>
            <Cell>Investors</Cell>
            <Cell>13.64000%</Cell>
            <Cell>A-Vesting</Cell>
            <Cell>12</Cell>
            <Cell>48</Cell>
            <Cell>0%</Cell>
            <Cell>0.00</Cell>
            <Cell>3,410,000.00</Cell>
            <Cell>284,166.67</Cell>
            <Cell>13,640,000.00</Cell>
          </Row>
          <Row isEven={false}>
            <Cell>Contributors</Cell>
            <Cell>Indiv. Contributors</Cell>
            <Cell>1.43500%</Cell>
            <Cell>A-Vesting</Cell>
            <Cell>12</Cell>
            <Cell>48</Cell>
            <Cell>0%</Cell>
            <Cell>0.00</Cell>
            <Cell>358,750.00</Cell>
            <Cell>29,895.83</Cell>
            <Cell>1,435,000.00</Cell>
          </Row>
          <SubtotalRow>
            <Cell col-span={2}>
              <strong>Contributors Total</strong>
            </Cell>
            <Cell>43.64000%</Cell>
            <td colSpan={4}></td>
            <Cell>0.00</Cell>
            <Cell>10,910,000.00</Cell>
            <td colSpan={1}></td>
            <Cell>43,640,000.00</Cell>
          </SubtotalRow>
          <Row isEven={true}>
            <Cell>Governance-Managed</Cell>
            <Cell>On-chain Treasury</Cell>
            <Cell>36.36000%</Cell>
            <Cell>n/a</Cell>
            <Cell>n/a</Cell>
            <Cell>n/a</Cell>
            <Cell>100%</Cell>
            <Cell>36,360,000.00</Cell>
            <Cell>n/a</Cell>
            <Cell>n/a</Cell>
            <Cell>36,360,000.00</Cell>
          </Row>
          <Row isEven={false}>
            <Cell>Governance-Managed</Cell>
            <Cell>Foundation</Cell>
            <Cell>15.00000%</Cell>
            <Cell>A-Vesting</Cell>
            <Cell>12</Cell>
            <Cell>48</Cell>
            <Cell>5%</Cell>
            <Cell>750,000.00</Cell>
            <Cell>3,562,500.00</Cell>
            <Cell>296,875.00</Cell>
            <Cell>15,000,000.00</Cell>
          </Row>
          <SubtotalRow>
            <Cell col-span={2}>
              <strong>Governance-Managed Total</strong>
            </Cell>
            <Cell>51.36000%</Cell>
            <td colSpan={4}></td>
            <Cell>37,110,000.00</Cell>
            <Cell>3,562,500.00</Cell>
            <td colSpan={1}></td>
            <Cell>51,360,000.00</Cell>
          </SubtotalRow>
          <Row isEven={true}>
            <Cell>Airdrop Pool</Cell>
            <Cell>Leaderboard Participants</Cell>
            <Cell>2.00000%</Cell>
            <Cell>B-Vesting</Cell>
            <Cell>1</Cell>
            <Cell>24</Cell>
            <Cell>5%</Cell>
            <Cell>100,000.00</Cell>
            <Cell>79,166.67</Cell>
            <Cell>82,608.70</Cell>
            <Cell>2,000,000.00</Cell>
          </Row>
          <Row isEven={false}>
            <Cell>Airdrop Pool</Cell>
            <Cell>DOT Validators Snapshot</Cell>
            <Cell>1.00000%</Cell>
            <Cell>B-Vesting</Cell>
            <Cell>1</Cell>
            <Cell>24</Cell>
            <Cell>5%</Cell>
            <Cell>50,000.00</Cell>
            <Cell>39,583.33</Cell>
            <Cell>41,304.35</Cell>
            <Cell>1,000,000.00</Cell>
          </Row>
          <Row isEven={true}>
            <Cell>Airdrop Pool</Cell>
            <Cell>EDG Genesis Participants</Cell>
            <Cell>1.00000%</Cell>
            <Cell>B-Vesting</Cell>
            <Cell>1</Cell>
            <Cell>24</Cell>
            <Cell>5%</Cell>
            <Cell>50,000.00</Cell>
            <Cell>39,583.33</Cell>
            <Cell>41,304.35</Cell>
            <Cell>1,000,000.00</Cell>
          </Row>
          <Row isEven={false}>
            <Cell>Airdrop Pool</Cell>
            <Cell>EDG 2023 Snapshot</Cell>
            <Cell>1.00000%</Cell>
            <Cell>B-Vesting</Cell>
            <Cell>1</Cell>
            <Cell>24</Cell>
            <Cell>5%</Cell>
            <Cell>50,000.00</Cell>
            <Cell>39,583.33</Cell>
            <Cell>41,304.35</Cell>
            <Cell>1,000,000.00</Cell>
          </Row>
          <SubtotalRow>
            <Cell col-span={2}>
              <strong>Airdrop Pools Total</strong>
            </Cell>
            <Cell>5.00000%</Cell>
            <td colSpan={4}></td>
            <Cell>250,000.00</Cell>
            <Cell>197,916.67</Cell>
            <Cell>206,521.74</Cell>
            <Cell>5,000,000.00</Cell>
          </SubtotalRow>
          <TotalRow>
            <Cell col-span={2}>
              <strong>Total Supply</strong>
            </Cell>
            <Cell>100.00000%</Cell>
            <td colSpan={4}></td>
            <Cell>37,360,000.00</Cell>
            <td colSpan={2}></td>
            <Cell>100,000,000.00</Cell>
          </TotalRow>
        </tbody>
      </table>
    </div>
  );
}
